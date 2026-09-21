import React, { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  Search, 
  Plus, 
  Check, 
  Clock, 
  HardDrive, 
  Trash2, 
  FileText, 
  Sparkles, 
  Filter, 
  ArrowRight,
  Download,
  Wifi,
  WifiOff,
  Cloud
} from 'lucide-react';
import { Book, BookFormat } from '../types';

interface LibraryViewProps {
  books: Book[];
  onOpenBook: (book: Book) => void;
  onImportFile: (file: File) => Promise<void>;
  onDeleteBook: (id: string) => void;
  onToggleOffline: (book: Book) => void;
  isImporting: boolean;
  importError?: string | null;
  storageUsage: { usedBytes: number; quotaBytes: number };
  onOpenPreferences: () => void;
  onOpenSync: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  onOpenBook,
  onImportFile,
  onDeleteBook,
  onToggleOffline,
  isImporting,
  importError,
  storageUsage,
  onOpenPreferences,
  onOpenSync,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [isDragOver, setIsDragOver] = useState(false);

  // Filter books
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || b.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  // Recent book (highest lastReadAt)
  const recentBook = [...books].sort((a, b) => (b.progress?.lastReadAt || 0) - (a.progress?.lastReadAt || 0))[0];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onImportFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFormatBadgeStyle = (format: BookFormat) => {
    switch (format) {
      case 'epub':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'pdf':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'txt':
      case 'md':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Top Banner / Drag Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-40 bg-sky-950/80 backdrop-blur-md flex items-center justify-center border-4 border-dashed border-sky-400 m-4 rounded-3xl animate-in fade-in">
          <div className="text-center text-white space-y-3">
            <Upload className="w-16 h-16 mx-auto text-sky-400 animate-bounce" />
            <h3 className="text-2xl font-bold">Drop EPUB, PDF, TXT or MD File</h3>
            <p className="text-slate-300 text-sm">Lumina will parse and cache it for instant offline reading</p>
          </div>
        </div>
      )}

      {/* Hero: Last Read Book & Quick Stats */}
      {recentBook && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-sky-950/40 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Continue Reading
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getFormatBadgeStyle(recentBook.format)}`}>
                  {recentBook.format}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                {recentBook.title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                by <span className="text-sky-400">{recentBook.author}</span>
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progress: {recentBook.progress?.percentage || 0}%</span>
                  <span>{recentBook.chapters ? `${recentBook.chapters.length} Chapters` : 'Document'}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${recentBook.progress?.percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Resume Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenBook(recentBook)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/25 transition-all hover:scale-102 active:scale-98"
              >
                <BookOpen className="w-4 h-4" />
                <span>Resume Reading</span>
              </button>
            </div>
          </div>

          {/* Ambient luminous glow background */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      {/* Library Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 backdrop-blur-md transition-all"
          />
        </div>

        {/* Format Filter Tabs & Add Book */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
            {['all', 'epub', 'pdf', 'txt'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-lg text-xs font-medium uppercase transition-colors ${
                  selectedFormat === fmt
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Import Button */}
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-100 text-xs sm:text-sm font-semibold cursor-pointer border border-white/10 backdrop-blur-md transition-colors shrink-0">
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Add Book</span>
            <input
              type="file"
              accept=".epub,.pdf,.txt,.md"
              className="hidden"
              onChange={handleFileInput}
              disabled={isImporting}
            />
          </label>
        </div>
      </div>

      {/* Error notification */}
      {importError && (
        <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center justify-between">
          <span>Failed to import book: {importError}</span>
        </div>
      )}

      {/* Books Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">
            Books in Library ({filteredBooks.length})
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span>IndexedDB Offline Ready</span>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-slate-900/40 p-8 space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-slate-500" />
            <h3 className="text-base font-semibold text-slate-300">No books found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Drag and drop any EPUB, PDF, or text file here, or click "Add Book" to start reading.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBooks.map((book) => {
              const isFinished = (book.progress?.percentage || 0) >= 99;
              return (
                <div
                  key={book.id}
                  className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-white/10 hover:border-sky-500/40 p-5 backdrop-blur-xl shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getFormatBadgeStyle(book.format)}`}>
                        {book.format}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {book.isOfflineCached && (
                          <span 
                            className="flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full"
                            title="Cached in local IndexedDB for uninterrupted offline reading"
                          >
                            <Check className="w-3 h-3" />
                            <span>Offline Ready</span>
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteBook(book.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Book Cover Placeholder or Art */}
                    <div 
                      onClick={() => onOpenBook(book)}
                      className="cursor-pointer relative h-40 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 border border-white/5 flex flex-col justify-between p-4 shadow-inner"
                    >
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                      ) : (
                        <>
                          <div className="space-y-1">
                            <h3 className="font-bold text-sm text-slate-100 line-clamp-2 leading-tight">
                              {book.title}
                            </h3>
                            <p className="text-xs text-sky-400 truncate">{book.author}</p>
                          </div>

                          <div className="flex justify-between items-end">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatFileSize(book.fileSize)}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Read Overlay Button */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs shadow-lg">
                          <span>Open Book</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div>
                      <h4 
                        onClick={() => onOpenBook(book)}
                        className="font-semibold text-slate-100 text-sm line-clamp-1 cursor-pointer hover:text-sky-300 transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{book.author}</p>
                    </div>
                  </div>

                  {/* Progress & Action Bottom */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{isFinished ? 'Completed' : `${book.progress?.percentage || 0}% Read`}</span>
                      <span>
                        {book.chapters ? `${book.progress?.currentChapterIndex + 1 || 1}/${book.chapters.length} Ch` : 'Paged'}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${book.progress?.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Info Banner: Windows 10/11 Architecture & Cloud Sync Overview */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Lumina Engine for Windows 10 & 11</div>
            <div>Minimal RAM & CPU footprint • Frosted Glass Acrylic & Mica • Offline First • Cloud Device Sync</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPreferences}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition-colors"
          >
            Customize Themes
          </button>
          <button
            onClick={onOpenSync}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors flex items-center gap-1.5"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Sync Devices</span>
          </button>
        </div>
      </div>
    </div>
  );
};
