import React, { useState } from 'react';
import { X, BookOpen, Search, Check, Clock } from 'lucide-react';
import { Chapter } from '../types';

interface TableOfContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  isOpen,
  onClose,
  chapters,
  currentChapterIndex,
  onSelectChapter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredChapters = chapters
    .map((chap, idx) => ({ ...chap, originalIndex: idx }))
    .filter((chap) => chap.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const estimateMinutes = (wordCount: number = 500) => {
    return Math.max(1, Math.round(wordCount / 220));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl bg-slate-900/95 text-slate-100 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Table of Contents</h2>
              <p className="text-xs text-slate-400">{chapters.length} Chapters / Sections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-white/10 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No matching chapters found.
            </div>
          ) : (
            filteredChapters.map((chap) => {
              const isCurrent = chap.originalIndex === currentChapterIndex;
              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    onSelectChapter(chap.originalIndex);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'border-sky-400/60 bg-sky-500/20 text-sky-200'
                      : 'border-white/5 hover:border-white/15 hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className={`text-xs font-mono w-6 text-center shrink-0 ${isCurrent ? 'text-sky-400 font-bold' : 'text-slate-500'}`}>
                      {chap.originalIndex + 1}
                    </span>
                    <span className="text-xs font-medium truncate">{chap.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {estimateMinutes(chap.wordCount)}m
                    </span>
                    {isCurrent && <Check className="w-4 h-4 text-sky-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex justify-between items-center text-xs text-slate-400">
          <span>Current: Chapter {currentChapterIndex + 1} of {chapters.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
