import JSZip from 'jszip';
import { Book, Chapter } from '../types';

export interface ParsedEpub {
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  chapters: Chapter[];
  resourceMap: Map<string, string>; // Maps internal href to blob/data URL
}

export async function parseEpubFile(fileBuffer: ArrayBuffer, fileName: string): Promise<ParsedEpub> {
  const zip = await JSZip.loadAsync(fileBuffer);

  // 1. Locate container.xml to find the OPF file path
  const containerFile = zip.file('META-INF/container.xml');
  if (!containerFile) {
    throw new Error('Invalid EPUB: META-INF/container.xml not found.');
  }
  const containerXml = await containerFile.async('text');
  const parser = new DOMParser();
  const containerDoc = parser.parseFromString(containerXml, 'application/xml');
  const rootfileEl = containerDoc.querySelector('rootfile');
  const opfPath = rootfileEl?.getAttribute('full-path');

  if (!opfPath) {
    throw new Error('Invalid EPUB: OPF rootfile path not found.');
  }

  const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';
  const opfFile = zip.file(opfPath);
  if (!opfFile) {
    throw new Error(`Invalid EPUB: OPF file at ${opfPath} not found.`);
  }

  const opfXml = await opfFile.async('text');
  const opfDoc = parser.parseFromString(opfXml, 'application/xml');

  // 2. Extract Metadata
  const titleEl = opfDoc.querySelector('title, dc\\:title');
  const creatorEl = opfDoc.querySelector('creator, dc\\:creator');
  const descEl = opfDoc.querySelector('description, dc\\:description');

  const title = titleEl?.textContent?.trim() || fileName.replace(/\.[^/.]+$/, '');
  const author = creatorEl?.textContent?.trim() || 'Unknown Author';
  const description = descEl?.textContent?.trim() || '';

  // 3. Extract Manifest
  const manifestItems: Record<string, { href: string; mediaType: string }> = {};
  let coverHref: string | null = null;

  opfDoc.querySelectorAll('manifest > item').forEach((item) => {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    const mediaType = item.getAttribute('media-type');
    const properties = item.getAttribute('properties') || '';

    if (id && href && mediaType) {
      manifestItems[id] = { href, mediaType };

      // Check for cover image
      if (properties.includes('cover-image') || id.toLowerCase().includes('cover') || href.toLowerCase().includes('cover')) {
        if (mediaType.startsWith('image/')) {
          coverHref = href;
        }
      }
    }
  });

  // Extract cover image if available
  let coverUrl: string | undefined;
  if (coverHref) {
    const fullCoverPath = resolvePath(opfDir, coverHref);
    const coverFile = zip.file(fullCoverPath) || zip.file(coverHref);
    if (coverFile) {
      const blob = await coverFile.async('blob');
      coverUrl = URL.createObjectURL(blob);
    }
  }

  // 4. Extract Images into Resource Map for Offline Rendering
  const resourceMap = new Map<string, string>();
  for (const [, item] of Object.entries(manifestItems)) {
    if (item.mediaType.startsWith('image/')) {
      const fullPath = resolvePath(opfDir, item.href);
      const file = zip.file(fullPath) || zip.file(item.href);
      if (file) {
        try {
          const base64 = await file.async('base64');
          const dataUrl = `data:${item.mediaType};base64,${base64}`;
          resourceMap.set(item.href, dataUrl);
          resourceMap.set(fullPath, dataUrl);
          // Also set simple filename key
          const simpleName = item.href.split('/').pop();
          if (simpleName) resourceMap.set(simpleName, dataUrl);
        } catch {
          // Ignore failed image decode
        }
      }
    }
  }

  // 5. Extract Spine (Reading Order)
  const spineItemRefs: string[] = [];
  opfDoc.querySelectorAll('spine > itemref').forEach((itemref) => {
    const idref = itemref.getAttribute('idref');
    if (idref && manifestItems[idref]) {
      spineItemRefs.push(idref);
    }
  });

  // 6. Extract Table of Contents Titles (NCX or EPUB 3 Nav)
  const tocTitles: Record<string, string> = {};

  // Try NCX
  const ncxItem = Object.values(manifestItems).find(
    (item) => item.mediaType === 'application/x-dtbncx+xml' || item.href.endsWith('.ncx')
  );
  if (ncxItem) {
    const ncxPath = resolvePath(opfDir, ncxItem.href);
    const ncxFile = zip.file(ncxPath) || zip.file(ncxItem.href);
    if (ncxFile) {
      const ncxXml = await ncxFile.async('text');
      const ncxDoc = parser.parseFromString(ncxXml, 'application/xml');
      ncxDoc.querySelectorAll('navPoint').forEach((navPoint) => {
        const text = navPoint.querySelector('navLabel > text')?.textContent?.trim();
        const contentSrc = navPoint.querySelector('content')?.getAttribute('src');
        if (text && contentSrc) {
          const cleanSrc = contentSrc.split('#')[0];
          tocTitles[cleanSrc] = text;
          const simpleSrc = cleanSrc.split('/').pop() || cleanSrc;
          tocTitles[simpleSrc] = text;
        }
      });
    }
  }

  // 7. Extract & Sanitize Chapters
  const chapters: Chapter[] = [];

  for (let i = 0; i < spineItemRefs.length; i++) {
    const idref = spineItemRefs[i];
    const item = manifestItems[idref];
    if (!item) continue;

    const chapterPath = resolvePath(opfDir, item.href);
    const chapterFile = zip.file(chapterPath) || zip.file(item.href);
    if (!chapterFile) continue;

    const rawHtml = await chapterFile.async('text');
    const chapterDoc = parser.parseFromString(rawHtml, 'text/html');

    // Rewrite images to offline Data URLs
    chapterDoc.querySelectorAll('img, image').forEach((img) => {
      const src = img.getAttribute('src') || img.getAttribute('xlink:href');
      if (src) {
        const simpleSrc = src.split('/').pop() || src;
        const resolvedSrc = resourceMap.get(src) || resourceMap.get(simpleSrc);
        if (resolvedSrc) {
          img.setAttribute('src', resolvedSrc);
        }
      }
    });

    // Remove unsafe script or link tags
    chapterDoc.querySelectorAll('script, style, link[rel="stylesheet"]').forEach((el) => el.remove());

    // Extract chapter heading
    const simpleHref = item.href.split('/').pop() || item.href;
    const detectedTitle =
      tocTitles[item.href] ||
      tocTitles[simpleHref] ||
      chapterDoc.querySelector('h1, h2, h3')?.textContent?.trim() ||
      chapterDoc.querySelector('title')?.textContent?.trim() ||
      `Chapter ${i + 1}`;

    const bodyContent = chapterDoc.body ? chapterDoc.body.innerHTML : rawHtml;
    const textOnly = chapterDoc.body?.textContent || '';
    const wordCount = textOnly.split(/\s+/).filter(Boolean).length;

    chapters.push({
      id: `chap-${i}`,
      title: detectedTitle,
      content: bodyContent,
      href: item.href,
      wordCount,
      pageNumber: i + 1,
    });
  }

  return {
    title,
    author,
    description,
    coverUrl,
    chapters,
    resourceMap,
  };
}

function resolvePath(baseDir: string, relativePath: string): string {
  if (relativePath.startsWith('/')) return relativePath.substring(1);
  const parts = (baseDir + relativePath).split('/');
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return stack.join('/');
}

export function parsePlainTextOrMarkdown(rawText: string, fileName: string, format: 'txt' | 'md'): Partial<Book> {
  const title = fileName.replace(/\.[^/.]+$/, '');
  const lines = rawText.split(/\r?\n/);
  
  // Split into chapters if headings like "Chapter 1", "# Heading", etc. exist
  const chapters: Chapter[] = [];
  let currentTitle = 'Beginning';
  let currentLines: string[] = [];
  let chapterIndex = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isMarkdownHeading = format === 'md' && /^#{1,3}\s+(.+)$/.test(line);
    const isChapterHeading = /^(chapter|part|book|section)\s+([0-9ivxlcdm]+|\w+)/i.test(line.trim());

    if ((isMarkdownHeading || isChapterHeading) && currentLines.length > 0) {
      chapters.push({
        id: `chap-${chapterIndex}`,
        title: currentTitle,
        content: formatContentToHtml(currentLines.join('\n'), format),
        wordCount: currentLines.join(' ').split(/\s+/).filter(Boolean).length,
        pageNumber: chapterIndex,
      });
      chapterIndex++;
      currentTitle = isMarkdownHeading ? line.replace(/^#{1,3}\s+/, '').trim() : line.trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    chapters.push({
      id: `chap-${chapterIndex}`,
      title: currentTitle,
      content: formatContentToHtml(currentLines.join('\n'), format),
      wordCount: currentLines.join(' ').split(/\s+/).filter(Boolean).length,
      pageNumber: chapterIndex,
    });
  }

  return {
    title,
    author: 'Author Unknown',
    description: `Imported ${format.toUpperCase()} document`,
    format,
    fileSize: new Blob([rawText]).size,
    chapters: chapters.length > 0 ? chapters : [
      {
        id: 'chap-1',
        title: 'Full Text',
        content: formatContentToHtml(rawText, format),
        wordCount: rawText.split(/\s+/).filter(Boolean).length,
        pageNumber: 1,
      }
    ],
  };
}

function formatContentToHtml(text: string, format: 'txt' | 'md'): string {
  if (format === 'md') {
    // Simple fast lightweight markdown formatter without heavy dependencies
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-sky-500 pl-4 italic my-3 text-slate-400">$1</blockquote>')
      .split(/\n\n+/)
      .map(p => `<p class="my-4 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  } else {
    // Plain text: wrap paragraphs in <p> tags
    return text
      .split(/\r?\n\r?\n+/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p class="my-4 leading-relaxed">${p.replace(/\r?\n/g, ' ')}</p>`)
      .join('');
  }
}
