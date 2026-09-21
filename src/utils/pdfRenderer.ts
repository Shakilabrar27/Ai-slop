import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
try {
  // Use official unpkg/cdnjs worker fallback or local module
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker setup fallback:', e);
}

export interface PDFMetadata {
  title: string;
  author: string;
  numPages: number;
}

export class PDFViewerEngine {
  private pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
  private currentRenderTask: pdfjsLib.RenderTask | null = null;

  async loadPDF(data: ArrayBuffer | Uint8Array): Promise<PDFMetadata> {
    const loadingTask = pdfjsLib.getDocument({
      data,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
    });

    this.pdfDoc = await loadingTask.promise;
    let title = 'PDF Document';
    let author = 'Unknown Author';

    try {
      const meta = await this.pdfDoc.getMetadata();
      const info = meta?.info as Record<string, string> | undefined;
      if (info) {
        if (info.Title) title = info.Title;
        if (info.Author) author = info.Author;
      }
    } catch {
      // Ignore metadata read error
    }

    return {
      title,
      author,
      numPages: this.pdfDoc.numPages,
    };
  }

  getNumPages(): number {
    return this.pdfDoc ? this.pdfDoc.numPages : 0;
  }

  async renderPage(
    pageNum: number,
    canvas: HTMLCanvasElement,
    scale: number = 1.2
  ): Promise<{ width: number; height: number }> {
    if (!this.pdfDoc) throw new Error('PDF Document not loaded');

    // Cancel any ongoing rendering on this canvas
    if (this.currentRenderTask) {
      try {
        this.currentRenderTask.cancel();
      } catch {
        // RenderTask cancellation is normal
      }
      this.currentRenderTask = null;
    }

    const page = await this.pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Ensure high-DPI crisp rendering on Windows 10/11 scaling (125%, 150%, 200%)
    const outputScale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not obtain 2D canvas context');

    ctx.save();
    ctx.scale(outputScale, outputScale);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    };

    const task = page.render(renderContext as any);
    this.currentRenderTask = task;

    await task.promise;
    ctx.restore();

    return { width: viewport.width, height: viewport.height };
  }

  async getPageText(pageNum: number): Promise<string> {
    if (!this.pdfDoc) return '';
    try {
      const page = await this.pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      return textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
    } catch {
      return '';
    }
  }

  destroy() {
    if (this.currentRenderTask) {
      try {
        this.currentRenderTask.cancel();
      } catch {
        // Ignore
      }
    }
    if (this.pdfDoc) {
      try {
        (this.pdfDoc as any).destroy?.();
        (this.pdfDoc as any).cleanup?.();
      } catch {
        // Ignore
      }
      this.pdfDoc = null;
    }
  }
}
