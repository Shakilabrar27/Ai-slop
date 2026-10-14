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
  Cloud,
  Edit3,
  Tag as TagIcon,
  FolderPlus,
  X as CloseIcon
} from 'lucide-react';
import { Book, BookFormat } from '../types';
import { EditBookModal } from './EditBookModal';

interface LibraryViewProps {
  books: Book[];
  onOpenBook: (book: Book) => void;
  onImportFile: (file: File) => Promise<void>;
  onDeleteBook: (id: string) => void;
  onToggleOffline: (book: Book) => void;
  onUpdateBook: (book: Book) => void;
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
  onUpdateBook,
  isImporting,
  importError,
  storageUsage,
  onOpenPreferences,
  onOpenSync,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Extract distinct categories from books
  const existingCategories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean) as string[])
  ).sort();

  // Extract distinct tags from books
  const existingTags = Array.from(
    new Set(books.flatMap((b) => b.tags || []).filter(Boolean))
  ).sort();

  // Filter books by search, format, category, and tag
  const filteredBooks = books.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)));
    const matchesFormat = selectedFormat === 'all' || b.format === selectedFormat;
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesTag = !selectedTag || (b.tags && b.tags.includes(selectedTag));
    return matchesSearch && matchesFormat && matchesCategory && matchesTag;
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

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return '';
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
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
            <p className="text-slate-300 text-sm">Corn Reader will parse and cache it for instant offline reading</p>
          </div>
        </div>
      )}

      {/* Hero: Last Read Book with 3:2 Cover Photo & Complete Metadata */}
      {recentBook && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-sky-950/50 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6">
            
            {/* Left: 3:2 Aspect Ratio Cover Photo & Book Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-3xl">
              {/* Cover Photo: 3:2 Aspect Ratio (2 width : 3 height portrait) */}
              <div 
                onClick={() => onOpenBook(recentBook)}
                className="cursor-pointer relative w-28 sm:w-36 md:w-40 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/20 shrink-0 group transition-all hover:scale-105 hover:shadow-sky-500/20 bg-slate-800"
                title={`Open "${recentBook.title}"`}
              >
                {recentBook.coverUrl ? (
                  <img
                    src={recentBook.coverUrl}
                    alt={recentBook.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 p-3 flex flex-col justify-between text-center border border-white/10">
                    <BookOpen className="w-6 h-6 mx-auto text-sky-400 mt-2" />
                    <div>
                      <p className="font-bold text-xs text-white line-clamp-3">{recentBook.title}</p>
                      <p className="text-[10px] text-sky-300 mt-1">{recentBook.author}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase">{recentBook.format}</span>
                  </div>
                )}
                
                {/* Subtle spine gradient reflection */}
                <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-medium text-xs shadow">Open</span>
                </div>
              </div>

              {/* Book Metadata Details */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Continue Reading
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getFormatBadgeStyle(recentBook.format)}`}>
                    {recentBook.format}
                  </span>
                  {recentBook.category && (
                    <span 
                      onClick={() => setSelectedCategory(selectedCategory === recentBook.category ? 'all' : (recentBook.category || 'all'))}
                      className="cursor-pointer px-2.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1 font-semibold hover:bg-violet-500/30 transition-colors"
                      title={`Filter by category "${recentBook.category}"`}
                    >
                      <FolderPlus className="w-3 h-3 text-violet-400" />
                      <span>{recentBook.category}</span>
                    </span>
                  )}
                  {recentBook.isOfflineCached && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Offline Ready
                    </span>
                  )}
                  {recentBook.progress?.lastReadAt && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatTimeAgo(recentBook.progress.lastReadAt)}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                  {recentBook.title}
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  by <span className="text-sky-400 font-semibold">{recentBook.author}</span>
                </p>

                {recentBook.description && (
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {recentBook.description}
                  </p>
                )}

                {/* Hero Tags */}
                {recentBook.tags && recentBook.tags.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                    {recentBook.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className="cursor-pointer text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/30 font-medium transition-colors"
                        title={`Filter by tag #${tag}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress bar and reading stats */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-medium text-sky-300">
                      Progress: {recentBook.progress?.percentage || 0}%
                    </span>
                    <span className="text-slate-400">
                      {recentBook.chapters ? `Chapter ${recentBook.progress?.currentChapterIndex + 1 || 1} of ${recentBook.chapters.length}` : `${recentBook.progress?.currentPage || 1} of ${recentBook.progress?.totalPages || 1} Pages`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${recentBook.progress?.percentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-col sm:flex-row md:flex-col items-center justify-center gap-2.5 shrink-0 self-center">
              <button
                onClick={() => onOpenBook(recentBook)}
                className="w-full sm:w-auto md:w-44 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-xl shadow-sky-600/30 transition-all hover:scale-102 active:scale-98"
              >
                <BookOpen className="w-4 h-4" />
                <span>Resume Reading</span>
              </button>
              
              <button
                onClick={() => setEditingBook(recentBook)}
                className="w-full sm:w-auto md:w-44 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-medium text-xs border border-white/15 transition-all"
                title="Edit Title, Author, Cover, Category, or Tags"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                <span>Edit Book Details</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center font-mono pt-1">
                {formatFileSize(recentBook.fileSize)} • IndexedDB Cached
              </div>
            </div>
          </div>

          {/* Ambient luminous glow background */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      {/* Library Controls Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search books, authors, categories, tags..."
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

        {/* Category Pills & Active Tag Filter Row */}
        {(existingCategories.length > 0 || selectedTag) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/5">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <FolderPlus className="w-3.5 h-3.5 text-sky-400" />
                <span>Categories:</span>
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                All ({books.length})
              </button>
              {existingCategories.map((cat) => {
                const count = books.filter((b) => b.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tag Filter Indicator */}
            {selectedTag && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">Tag:</span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 text-xs font-medium shadow-sm">
                  <TagIcon className="w-3 h-3 text-cyan-400" />
                  <span>#{selectedTag}</span>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-cyan-400 hover:text-white ml-1 p-0.5 rounded"
                    title="Clear Tag Filter"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[11px] text-slate-500 hover:text-slate-300 underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const isFinished = (book.progress?.percentage || 0) >= 99;
              return (
                <div
                  key={book.id}
                  className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/75 hover:bg-slate-900/95 border border-white/10 hover:border-sky-500/40 p-4 backdrop-blur-xl shadow-xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-sky-500/10"
                >
                  <div className="space-y-3.5">
                    {/* Top Meta Badges & Actions */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border shrink-0 ${getFormatBadgeStyle(book.format)}`}>
                          {book.format}
                        </span>

                        {book.category && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(selectedCategory === book.category ? 'all' : (book.category || 'all'));
                            }}
                            className="cursor-pointer px-2 py-0.5 rounded text-[10px] font-medium bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 transition-colors truncate max-w-[110px]"
                            title={`Category: ${book.category} (Click to filter)`}
                          >
                            {book.category}
                          </span>
                        )}

                        {book.isOfflineCached && (
                          <span 
                            className="flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium shrink-0"
                            title="Cached in local IndexedDB for uninterrupted offline reading"
                          >
                            <Check className="w-3 h-3" />
                            <span>Offline</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBook(book);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-white/10 transition-colors opacity-80 group-hover:opacity-100"
                          title="Edit Book Title, Author, Cover, Category, or Tags"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteBook(book.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Book from Library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Book Cover Photo: 3:2 Aspect Ratio (2 width : 3 height portrait) */}
                    <div 
                      onClick={() => onOpenBook(book)}
                      className="cursor-pointer relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 border border-white/10 shadow-lg group/cover transition-all"
                    >
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/cover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-4 flex flex-col justify-between border border-white/5 text-center">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-sky-400 mt-4">
                            <BookOpen className="w-5 h-5" />
                          </div>

                          <div className="space-y-1 my-auto">
                            <h3 className="font-bold text-sm text-slate-100 line-clamp-3 leading-snug">
                              {book.title}
                            </h3>
                            <p className="text-xs text-sky-300 truncate">{book.author}</p>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-white/10 pt-2">
                            <span>{book.format.toUpperCase()}</span>
                            <span>{formatFileSize(book.fileSize)}</span>
                          </div>
                        </div>
                      )}

                      {/* Left book spine gradient effect */}
                      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

                      {/* Hover Overlay Buttons */}
                      <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-xs p-3">
                        <span className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs shadow-xl shadow-sky-600/40">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read Book</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBook(book);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-slate-200 hover:text-white font-medium text-xs border border-white/20 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Edit Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Book Metadata Section */}
                    <div className="space-y-1.5">
                      <h4 
                        onClick={() => onOpenBook(book)}
                        className="font-semibold text-slate-100 text-sm line-clamp-1 cursor-pointer hover:text-sky-300 transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h4>
                      <p className="text-xs text-sky-400 font-medium truncate">{book.author}</p>

                      {book.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed" title={book.description}>
                          {book.description}
                        </p>
                      )}

                      {/* Tags row */}
                      {book.tags && book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {book.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(selectedTag === tag ? null : tag);
                              }}
                              className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 transition-colors"
                              title={`Filter by tag #${tag}`}
                            >
                              #{tag}
                            </span>
                          ))}
                          {book.tags.length > 3 && (
                            <span className="text-[10px] text-slate-500 self-center">
                              +{book.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Metadata Details Row */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                        <span>{formatFileSize(book.fileSize)}</span>
                        <span>{book.chapters ? `${book.chapters.length} Chapters` : `${book.progress?.totalPages || 1} Pages`}</span>
                        {book.progress?.lastReadAt && (
                          <span>{formatTimeAgo(book.progress.lastReadAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Footer */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span className="font-medium text-sky-300">
                        {isFinished ? 'Completed' : `${book.progress?.percentage || 0}% Read`}
                      </span>
                      <span className="text-slate-400">
                        {book.chapters 
                          ? `Ch ${book.progress?.currentChapterIndex + 1 || 1}/${book.chapters.length}` 
                          : `Pg ${book.progress?.currentPage || 1}/${book.progress?.totalPages || 1}`}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-300"
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
            <div className="font-semibold text-slate-200">Corn Reader Engine for Windows 10 & 11</div>
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

      {/* Edit Book Details Modal */}
      <EditBookModal
        isOpen={!!editingBook}
        book={editingBook}
        onClose={() => setEditingBook(null)}
        onSave={(updated) => {
          onUpdateBook(updated);
          setEditingBook(null);
        }}
        existingCategories={existingCategories}
        existingTags={existingTags}
      />
    </div>
  );
};
