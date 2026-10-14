import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark as BookmarkIcon, 
  Highlighter, 
  Menu, 
  Search, 
  Settings, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Check, 
  List, 
  Copy, 
  Plus, 
  FileText,
  Clock,
  Columns,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Book, Bookmark, Chapter, Highlight, ReaderPreferences } from '../types';
import { PDFViewerEngine } from '../utils/pdfRenderer';
import { ttsReader } from '../utils/speechSynth';
import { TableOfContentsModal } from './TableOfContentsModal';

interface ReaderViewProps {
  book: Book;
  fileBuffer?: ArrayBuffer | null;
  preferences: ReaderPreferences;
  bookmarks: Bookmark[];
  highlights: Highlight[];
  onUpdateProgress: (chapterIndex: number, percentage: number, page?: number, totalPages?: number) => void;
  onAddBookmark: (title: string, excerpt: string, chapterIndex: number, progressPercent: number) => void;
  onAddHighlight: (text: string, color: Highlight['color'], note?: string, chapterIndex?: number) => void;
  onOpenTableOfContents?: () => void;
  onOpenBookmarks: () => void;
  onOpenPreferences: () => void;
  onOpenSearch: () => void;
  isTTSPlaying: boolean;
  onToggleTTS: () => void;
  ttsHighlightRange?: { start: number; end: number } | null;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  fileBuffer,
  preferences,
  bookmarks,
  highlights,
  onUpdateProgress,
  onAddBookmark,
  onAddHighlight,
  onOpenTableOfContents,
  onOpenBookmarks,
  onOpenPreferences,
  onOpenSearch,
  isTTSPlaying,
  onToggleTTS,
  ttsHighlightRange,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(book.progress?.currentChapterIndex || 0);
  const [currentPage, setCurrentPage] = useState(book.progress?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(book.progress?.totalPages || (book.chapters ? book.chapters.length : 1));
  const [pdfScale, setPdfScale] = useState(1.2);
  const [isPdfLoading, setIsPdfLoading] = useState(book.format === 'pdf');
  const [isTocOpen, setIsTocOpen] = useState(false);

  // Text selection popup state
  const [selectedText, setSelectedText] = useState('');
  const [selectionCoords, setSelectionCoords] = useState<{ x: number; y: number } | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // PDF Engine
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfEngineRef = useRef<PDFViewerEngine | null>(null);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  const chapters = book.chapters || [];
  const currentChapter = chapters[currentChapterIndex] || {
    id: 'c-0',
    title: 'Content',
    content: '<p>Loading document content...</p>',
    pageNumber: 1,
  };

  // Sync total chapters/pages
  useEffect(() => {
    if (chapters.length > 0) {
      setTotalPages(chapters.length);
    }
  }, [chapters.length]);

  // Sync chapter if external progress changes (e.g. from bookmarks, search, or sync)
  useEffect(() => {
    if (
      typeof book.progress?.currentChapterIndex === 'number' &&
      book.progress.currentChapterIndex !== currentChapterIndex
    ) {
      setCurrentChapterIndex(book.progress.currentChapterIndex);
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [book.progress?.currentChapterIndex]);

  useEffect(() => {
    if (
      typeof book.progress?.currentPage === 'number' &&
      book.progress.currentPage !== currentPage
    ) {
      setCurrentPage(book.progress.currentPage);
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [book.progress?.currentPage]);

  // Reset when active book changes
  useEffect(() => {
    setCurrentChapterIndex(book.progress?.currentChapterIndex || 0);
    setCurrentPage(book.progress?.currentPage || 1);
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [book.id]);

  // Load PDF if format is PDF
  useEffect(() => {
    if (book.format === 'pdf' && fileBuffer) {
      setIsPdfLoading(true);
      const engine = new PDFViewerEngine();
      pdfEngineRef.current = engine;

      engine.loadPDF(fileBuffer).then((meta) => {
        setTotalPages(meta.numPages);
        setIsPdfLoading(false);
        renderCurrentPdfPage(currentPage);
      }).catch((err) => {
        console.error('PDF load failed:', err);
        setIsPdfLoading(false);
      });

      return () => {
        engine.destroy();
      };
    }
  }, [book.format, fileBuffer]);

  // Render PDF Page
  const renderCurrentPdfPage = useCallback(async (pageNum: number) => {
    if (book.format === 'pdf' && pdfEngineRef.current && pdfCanvasRef.current) {
      try {
        await pdfEngineRef.current.renderPage(pageNum, pdfCanvasRef.current, pdfScale);
      } catch (err) {
        console.error('Render PDF page error:', err);
      }
    }
  }, [book.format, pdfScale]);

  useEffect(() => {
    if (book.format === 'pdf' && !isPdfLoading) {
      renderCurrentPdfPage(currentPage);
    }
  }, [currentPage, pdfScale, isPdfLoading, renderCurrentPdfPage]);

  // Handle Chapter Navigation
  const goToChapter = (index: number) => {
    const totalChapters = chapters.length > 0 ? chapters.length : totalPages;
    if (index >= 0 && index < totalChapters) {
      setCurrentChapterIndex(index);
      const newPercentage = Math.round(((index + 1) / totalChapters) * 100);
      onUpdateProgress(index, newPercentage, index + 1, totalChapters);
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (isTTSPlaying) {
        onToggleTTS();
      }
    } else if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPdfPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const newPercentage = Math.round((page / totalPages) * 100);
      onUpdateProgress(0, newPercentage, page, totalPages);
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    if (book.format === 'pdf') {
      goToPdfPage(currentPage + 1);
    } else {
      goToChapter(currentChapterIndex + 1);
    }
  };

  const handlePrev = () => {
    if (book.format === 'pdf') {
      goToPdfPage(currentPage - 1);
    } else {
      goToChapter(currentChapterIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        handlePrev();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleQuickBookmark();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        onOpenSearch();
      } else if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        onOpenPreferences();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, currentPage, totalPages, book.format]);

  // Handle Text Selection for highlights
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectedText('');
      setSelectionCoords(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 2) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectionCoords({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    }
  };

  const applyHighlight = (color: Highlight['color']) => {
    if (selectedText) {
      onAddHighlight(selectedText, color, noteInput.trim() || undefined, currentChapterIndex);
      setSelectedText('');
      setSelectionCoords(null);
      setNoteInput('');
      setShowNoteInput(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleQuickBookmark = () => {
    const title = book.format === 'pdf' 
      ? `Page ${currentPage}` 
      : currentChapter.title || `Chapter ${currentChapterIndex + 1}`;
    
    // Grab first sentence as excerpt
    const plain = currentChapter.content.replace(/<[^>]*>?/gm, ' ').trim();
    const excerpt = plain.substring(0, 140) + '...';
    const percent = book.format === 'pdf'
      ? Math.round((currentPage / totalPages) * 100)
      : Math.round(((currentChapterIndex + 1) / totalPages) * 100);

    onAddBookmark(title, excerpt, currentChapterIndex, percent);
  };

  // Format Content with Bionic Reading (if enabled)
  const renderFormattedHtml = (html: string) => {
    if (!preferences.bionicReading) {
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Apply bionic fixation to words inside HTML
    const bionicHtml = html.replace(/\b([a-zA-Z]{2,})(\w*)\b/g, (match, prefix, suffix) => {
      const half = Math.ceil(prefix.length / 2);
      const boldPart = prefix.slice(0, half);
      const rest = prefix.slice(half) + suffix;
      return `<strong>${boldPart}</strong>${rest}`;
    });

    return <div dangerouslySetInnerHTML={{ __html: bionicHtml }} />;
  };

  // Get Theme Background & Text Classes
  const getThemeStyles = () => {
    switch (preferences.theme) {
      case 'frosted-glass': {
        const tintMap = {
          'windows-mica': 'rgba(15, 23, 42, OPACITY)',
          'ice-blue': 'rgba(8, 47, 73, OPACITY)',
          'obsidian-smoke': 'rgba(10, 10, 12, OPACITY)',
          'emerald-fog': 'rgba(6, 44, 34, OPACITY)',
          'rose-quartz': 'rgba(46, 16, 61, OPACITY)',
        };
        const baseColor = tintMap[preferences.glassTint].replace('OPACITY', `${preferences.glassOpacity}`);
        return {
          backgroundColor: baseColor,
          backdropFilter: 'blur(32px) saturate(190%)',
          WebkitBackdropFilter: 'blur(32px) saturate(190%)',
          color: '#f1f5f9',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        };
      }
      case 'oled-black':
        return { backgroundColor: '#000000', color: '#f4f4f5' };
      case 'slate-dark':
        return { backgroundColor: '#0f172a', color: '#e2e8f0' };
      case 'warm-sepia':
        return { backgroundColor: '#f5ecd8', color: '#3b2f1f' };
      case 'solarized-amber':
        return { backgroundColor: '#181512', color: '#e89e47' };
      case 'paper-white':
        return { backgroundColor: '#ffffff', color: '#0f172a' };
      default:
        return { backgroundColor: '#0f172a', color: '#e2e8f0' };
    }
  };

  const themeStyle = getThemeStyles();
  const isDark = preferences.theme !== 'paper-white' && preferences.theme !== 'warm-sepia';

  const calculateMinutesRemaining = () => {
    const remainingChaps = totalPages - (currentChapterIndex + 1);
    const avgWordsPerChap = currentChapter.wordCount || 1200;
    const totalWordsLeft = remainingChaps * avgWordsPerChap;
    return Math.max(1, Math.round(totalWordsLeft / 220));
  };

  return (
    <div 
      className="relative flex-1 flex flex-col h-full overflow-hidden select-text"
      style={{
        fontFamily: preferences.fontFamily,
      }}
      onMouseUp={handleMouseUp}
    >
      {/* Dynamic Ambient Background for Frosted Glass */}
      {preferences.theme === 'frosted-glass' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-sky-600/15 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>
      )}

      {/* Main Content Area */}
      <div 
        ref={contentContainerRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-8 flex justify-center scroll-smooth"
      >
        <div 
          className={`w-full transition-all duration-300 ${
            preferences.layout === 'dual' ? 'max-w-6xl' : ''
          }`}
          style={{
            maxWidth: preferences.layout === 'dual' ? '1200px' : `${preferences.maxWidth}px`,
          }}
        >
          {/* Reader Card Container */}
          <div 
            className="rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl transition-all relative overflow-hidden"
            style={themeStyle}
          >
            {/* Document Header Info */}
            <div className="flex items-center justify-between border-b pb-4 mb-8 border-current/10 text-xs opacity-75">
              <span className="font-semibold uppercase tracking-wider truncate max-w-[240px] sm:max-w-md">
                {book.title}
              </span>
              <span className="font-mono shrink-0">
                {book.format === 'pdf' 
                  ? `Page ${currentPage} of ${totalPages}` 
                  : `Chapter ${currentChapterIndex + 1} of ${totalPages}`}
              </span>
            </div>

            {/* PDF View (Canvas rendering) */}
            {book.format === 'pdf' && (
              <div className="flex flex-col items-center justify-center space-y-4">
                {isPdfLoading && (
                  <div className="text-center py-20 space-y-3">
                    <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs opacity-70">Rendering PDF Page with PDF.js...</p>
                  </div>
                )}
                <div className="relative shadow-2xl rounded-xl overflow-hidden bg-white">
                  <canvas ref={pdfCanvasRef} className="max-w-full h-auto block" />
                </div>

                {/* PDF Zoom Controls */}
                <div className="flex items-center gap-2 pt-2 text-xs">
                  <button
                    onClick={() => setPdfScale(Math.max(0.8, pdfScale - 0.2))}
                    className="p-1.5 rounded-lg bg-current/10 hover:bg-current/20 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs opacity-80">{Math.round(pdfScale * 100)}%</span>
                  <button
                    onClick={() => setPdfScale(Math.min(2.5, pdfScale + 0.2))}
                    className="p-1.5 rounded-lg bg-current/10 hover:bg-current/20 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* EPUB / Text Chapters View */}
            {book.format !== 'pdf' && (
              <div 
                className={`reading-selectable leading-relaxed ${
                  preferences.layout === 'dual' ? 'book-dual-column' : ''
                }`}
                style={{
                  fontSize: `${preferences.fontSize}px`,
                  lineHeight: preferences.lineHeight,
                  textAlign: preferences.textAlign,
                  letterSpacing: `${preferences.letterSpacing}em`,
                }}
              >
                {/* Chapter Title */}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 pb-2 border-b border-current/10">
                  {currentChapter.title}
                </h1>

                {/* Chapter HTML Content */}
                {renderFormattedHtml(currentChapter.content)}
              </div>
            )}

            {/* End of Chapter / Page Footnote */}
            <div className="mt-12 pt-6 border-t border-current/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-75">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>~{calculateMinutesRemaining()} mins left in book</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickBookmark}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-current/10 hover:bg-current/20 transition-colors"
                >
                  <BookmarkIcon className="w-3.5 h-3.5" />
                  <span>Bookmark this page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Text Selection Popup (Highlight & Note Menu) */}
      {selectedText && selectionCoords && (
        <div 
          className="fixed z-50 -translate-x-1/2 -translate-y-full mb-3 flex flex-col p-2 bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl animate-in zoom-in-95 text-slate-100"
          style={{ left: `${selectionCoords.x}px`, top: `${selectionCoords.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 pb-1">
            {/* Color Highlighter Pins */}
            {(['yellow', 'green', 'pink', 'blue', 'purple'] as Highlight['color'][]).map((col) => {
              const bgClass = {
                yellow: 'bg-amber-400',
                green: 'bg-emerald-400',
                pink: 'bg-pink-400',
                blue: 'bg-sky-400',
                purple: 'bg-purple-400',
              }[col];

              return (
                <button
                  key={col}
                  onClick={() => applyHighlight(col)}
                  className={`w-6 h-6 rounded-full ${bgClass} hover:scale-110 active:scale-95 shadow-md transition-transform border border-black/20`}
                  title={`Highlight in ${col}`}
                />
              );
            })}

            <div className="h-4 w-px bg-white/20 mx-1" />

            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-xs font-medium flex items-center gap-1 text-slate-300"
              title="Attach Note"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Note</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedText);
                setSelectedText('');
                setSelectionCoords(null);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300"
              title="Copy Text"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {showNoteInput && (
            <div className="pt-2 border-t border-white/10 flex gap-1.5 mt-1">
              <input
                type="text"
                placeholder="Add annotation note..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="bg-slate-950 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sky-400 w-44"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyHighlight('yellow');
                }}
              />
              <button
                onClick={() => applyHighlight('yellow')}
                className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium"
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Reading Control Bar */}
      <div className="relative z-30 px-4 py-2.5 bg-slate-950/85 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-4 text-xs text-slate-300">
        {/* Left: Table of Contents & Bookmarks */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsTocOpen(true);
              onOpenTableOfContents?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-slate-200 transition-colors"
            title="Table of Contents"
          >
            <List className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline font-medium">Contents</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-slate-200 transition-colors"
            title="Bookmarks & Notes"
          >
            <BookmarkIcon className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline font-medium">Bookmarks ({bookmarks.length})</span>
          </button>
        </div>

        {/* Center: Stepper & Page Slider */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-center">
          <button
            onClick={handlePrev}
            disabled={book.format === 'pdf' ? currentPage <= 1 : currentChapterIndex <= 0}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page / Chapter (Left Arrow / Space)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 hidden md:flex items-center gap-2">
            <input
              type="range"
              min={book.format === 'pdf' ? 1 : 0}
              max={book.format === 'pdf' ? totalPages : Math.max(0, totalPages - 1)}
              value={book.format === 'pdf' ? currentPage : currentChapterIndex}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (book.format === 'pdf') {
                  goToPdfPage(val);
                } else {
                  goToChapter(val);
                }
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <span className="font-mono text-xs font-semibold text-slate-200 shrink-0">
            {book.format === 'pdf'
              ? `${currentPage} / ${totalPages}`
              : `${currentChapterIndex + 1} / ${totalPages}`}
          </span>

          <button
            onClick={handleNext}
            disabled={book.format === 'pdf' ? currentPage >= totalPages : currentChapterIndex >= totalPages - 1}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page / Chapter (Right Arrow / Space)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Quick Settings */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleTTS}
            className={`p-2 rounded-xl transition-colors ${
              isTTSPlaying ? 'bg-sky-500/20 text-sky-400 animate-pulse' : 'hover:bg-white/10 text-slate-300'
            }`}
            title={isTTSPlaying ? 'Pause Narrator' : 'Read Aloud'}
          >
            {isTTSPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPreferences}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-sky-300 transition-colors"
            title="Font Size & Frosted Glass Themes (Ctrl+,)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table of Contents Modal */}
      <TableOfContentsModal
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        chapters={
          chapters.length > 0
            ? chapters
            : Array.from({ length: totalPages }, (_, i) => ({
                id: `pdf-page-${i + 1}`,
                title: `Page ${i + 1}`,
                pageNumber: i + 1,
                content: '',
              }))
        }
        currentChapterIndex={book.format === 'pdf' ? currentPage - 1 : currentChapterIndex}
        onSelectChapter={(index) => {
          if (book.format === 'pdf') {
            goToPdfPage(index + 1);
          } else {
            goToChapter(index);
          }
        }}
      />
    </div>
  );
};
