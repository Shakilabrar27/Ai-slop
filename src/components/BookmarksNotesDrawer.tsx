import React, { useState } from 'react';
import { X, Bookmark as BookmarkIcon, Highlighter, Trash2, ArrowRight, Plus } from 'lucide-react';
import { Bookmark, Highlight } from '../types';

interface BookmarksNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  highlights: Highlight[];
  currentChapterIndex: number;
  onJumpToBookmark: (bookmark: Bookmark) => void;
  onJumpToHighlight: (highlight: Highlight) => void;
  onDeleteBookmark: (id: string) => void;
  onDeleteHighlight: (id: string) => void;
  onAddBookmark: () => void;
}

export const BookmarksNotesDrawer: React.FC<BookmarksNotesDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  highlights,
  currentChapterIndex,
  onJumpToBookmark,
  onJumpToHighlight,
  onDeleteBookmark,
  onDeleteHighlight,
  onAddBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>('bookmarks');

  if (!isOpen) return null;

  const getHighlightColorBadge = (color: Highlight['color']) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/40';
      case 'green':
        return 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40';
      case 'pink':
        return 'bg-pink-400/20 text-pink-300 border-pink-400/40';
      case 'blue':
        return 'bg-sky-400/20 text-sky-300 border-sky-400/40';
      case 'purple':
        return 'bg-purple-400/20 text-purple-300 border-purple-400/40';
      default:
        return 'bg-slate-400/20 text-slate-300 border-slate-400/40';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md h-full flex flex-col bg-slate-900/95 text-slate-100 border-l border-white/15 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold tracking-tight">Annotations & Marks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs & Add Action */}
        <div className="p-3 border-b border-white/10 bg-slate-950/40 flex items-center justify-between gap-2">
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'bookmarks'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookmarkIcon className="w-3.5 h-3.5" />
              <span>Bookmarks ({bookmarks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'highlights'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Highlights ({highlights.length})</span>
            </button>
          </div>

          {activeTab === 'bookmarks' && (
            <button
              onClick={onAddBookmark}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sky-400 text-xs font-medium transition-colors"
              title="Bookmark current location"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {activeTab === 'bookmarks' && (
            <>
              {bookmarks.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <BookmarkIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p>No bookmarks saved yet.</p>
                  <p className="text-[11px] text-slate-600 mt-1">Press Ctrl+B or click 'Add' to bookmark this page.</p>
                </div>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-slate-200 truncate">{bm.title}</span>
                      <button
                        onClick={() => onDeleteBookmark(bm.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/10 transition-colors opacity-80 group-hover:opacity-100"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-400 line-clamp-2 text-[11px] mb-2">{bm.excerpt}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
                      <span>{new Date(bm.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => {
                          onJumpToBookmark(bm);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                      >
                        <span>Jump to page</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'highlights' && (
            <>
              {highlights.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Highlighter className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p>No text highlights created yet.</p>
                  <p className="text-[11px] text-slate-600 mt-1">Select text in any book to highlight or attach notes.</p>
                </div>
              ) : (
                highlights.map((hl) => (
                  <div
                    key={hl.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-medium capitalize ${getHighlightColorBadge(hl.color)}`}>
                        {hl.color}
                      </span>
                      <button
                        onClick={() => onDeleteHighlight(hl.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/10 transition-colors opacity-80 group-hover:opacity-100"
                        title="Delete Highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <blockquote className="border-l-2 border-sky-400/60 pl-2.5 py-0.5 my-1.5 italic text-slate-200 text-[11px] line-clamp-3">
                      "{hl.text}"
                    </blockquote>
                    {hl.note && (
                      <p className="text-[11px] text-sky-300 bg-sky-950/40 p-2 rounded border border-sky-500/20 mt-2">
                        Note: {hl.note}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5 mt-2">
                      <span>Chapter {hl.chapterIndex + 1}</span>
                      <button
                        onClick={() => {
                          onJumpToHighlight(hl);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                      >
                        <span>Jump to passage</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
