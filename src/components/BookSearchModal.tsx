import React, { useState } from 'react';
import { X, Search, ArrowRight, BookOpen } from 'lucide-react';
import { Chapter } from '../types';

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  onSelectResult: (chapterIndex: number, matchText: string) => void;
}

interface SearchMatch {
  chapterIndex: number;
  chapterTitle: string;
  excerpt: string;
  matchIndex: number;
}

export const BookSearchModal: React.FC<BookSearchModalProps> = ({
  isOpen,
  onClose,
  chapters,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const matches: SearchMatch[] = [];

  if (query.trim().length >= 2) {
    const cleanQuery = query.trim().toLowerCase();

    chapters.forEach((chap, cIdx) => {
      // Clean HTML tags to search plain text
      const plainText = chap.content.replace(/<[^>]*>?/gm, ' ');
      const lowerText = plainText.toLowerCase();
      let startIndex = 0;

      while (matches.length < 50) {
        const found = lowerText.indexOf(cleanQuery, startIndex);
        if (found === -1) break;

        const excerptStart = Math.max(0, found - 50);
        const excerptEnd = Math.min(plainText.length, found + cleanQuery.length + 50);
        const excerpt = plainText.substring(excerptStart, excerptEnd);

        matches.push({
          chapterIndex: cIdx,
          chapterTitle: chap.title,
          excerpt,
          matchIndex: found,
        });

        startIndex = found + cleanQuery.length + 10;
      }
    });
  }

  const highlightMatchInExcerpt = (text: string, term: string) => {
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} className="bg-sky-500/40 text-sky-200 px-0.5 rounded font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
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
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Search in Document</h2>
              <p className="text-xs text-slate-400">Find keywords across all chapters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Type word or phrase (e.g. Frankenstein, dimension, rabbit)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
            <span>{query.trim().length >= 2 ? `${matches.length} matches found` : 'Enter at least 2 characters'}</span>
            <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded">Ctrl + F</span>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
          {query.trim().length >= 2 && matches.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No results found for "{query}".
            </div>
          ) : (
            matches.map((match, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelectResult(match.chapterIndex, query);
                  onClose();
                }}
                className="w-full p-3 rounded-xl border border-white/5 hover:border-sky-400/40 bg-white/5 hover:bg-sky-500/10 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sky-400 text-[11px] flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    {match.chapterTitle}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-sky-300 flex items-center gap-1">
                    Jump <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-slate-300 line-clamp-2 text-[11px] leading-relaxed">
                  ...{highlightMatchInExcerpt(match.excerpt, query.trim())}...
                </p>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
