import React, { useState, useEffect, useCallback } from 'react';
import { 
  Book, 
  Bookmark, 
  Highlight, 
  ReaderPreferences, 
  ReadingProgress, 
  SyncDataPayload, 
  SyncDevice 
} from './types';
import { 
  getAllBooksFromDB, 
  saveBookToDB, 
  deleteBookFromDB, 
  updateReadingProgressInDB, 
  getBookmarksForBook, 
  saveBookmarkToDB, 
  deleteBookmarkFromDB, 
  getHighlightsForBook, 
  saveHighlightToDB, 
  deleteHighlightFromDB, 
  savePreferencesToDB, 
  getPreferencesFromDB, 
  estimateStorageUsage, 
  getBookFileFromDB 
} from './utils/indexedDB';
import { INITIAL_SAMPLE_BOOKS } from './data/sampleBooks';
import { parseEpubFile, parsePlainTextOrMarkdown } from './utils/epubParser';
import { 
  getCloudSyncPayload, 
  getRegisteredDevices, 
  mergeCloudSyncPayload, 
  pushToCloudSync, 
  subscribeToSyncUpdates 
} from './utils/syncEngine';
import { ttsReader } from './utils/speechSynth';
import { WindowsTitleBar } from './components/WindowsTitleBar';
import { LibraryView } from './components/LibraryView';
import { ReaderView } from './components/ReaderView';
import { FrostedThemePanel } from './components/FrostedThemePanel';
import { CloudSyncModal } from './components/CloudSyncModal';
import { TableOfContentsModal } from './components/TableOfContentsModal';
import { BookmarksNotesDrawer } from './components/BookmarksNotesDrawer';
import { BookSearchModal } from './components/BookSearchModal';

const DEFAULT_PREFERENCES: ReaderPreferences = {
  theme: 'frosted-glass', // User requested Frosted Glass theme
  glassTint: 'windows-mica',
  glassOpacity: 0.72,
  fontSize: 18,
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  lineHeight: 1.65,
  letterSpacing: 0,
  paragraphSpacing: 1.2,
  textAlign: 'justify',
  maxWidth: 820,
  layout: 'single',
  bionicReading: false,
  brightness: 100,
  speechRate: 1.0,
  speechPitch: 1.0,
};

export default function App() {
  // Books & Active State
  const [books, setBooks] = useState<Book[]>([]);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [activeFileBuffer, setActiveFileBuffer] = useState<ArrayBuffer | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Preferences & Themes
  const [preferences, setPreferences] = useState<ReaderPreferences>(DEFAULT_PREFERENCES);

  // Modals & Panels
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync & Offline State
  const [devices, setDevices] = useState<SyncDevice[]>(getRegisteredDevices());
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [storageEstimate, setStorageEstimate] = useState<{ usedBytes: number; quotaBytes: number }>({ usedBytes: 0, quotaBytes: 0 });
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // TTS State
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize DB, Books & Preferences
  useEffect(() => {
    async function initApp() {
      try {
        // Load preferences
        const savedPrefs = await getPreferencesFromDB();
        if (savedPrefs) {
          setPreferences(savedPrefs);
        }

        // Load books
        const storedBooks = await getAllBooksFromDB();
        if (storedBooks.length > 0) {
          setBooks(storedBooks);
        } else {
          // Seed sample books into IndexedDB for instantaneous offline readiness
          for (const sb of INITIAL_SAMPLE_BOOKS) {
            await saveBookToDB(sb);
          }
          setBooks(INITIAL_SAMPLE_BOOKS);
        }

        // Check storage usage
        const estimate = await estimateStorageUsage();
        setStorageEstimate(estimate);
      } catch (err) {
        console.error('App init error:', err);
        setBooks(INITIAL_SAMPLE_BOOKS);
      }
    }

    initApp();
  }, []);

  // Listen to cross-window / cross-device broadcast sync
  useEffect(() => {
    const unsubscribe = subscribeToSyncUpdates((payload: SyncDataPayload) => {
      setLastSyncTime(payload.timestamp);
      // Merge progress
      setBooks((prevBooks) =>
        prevBooks.map((b) => {
          const remoteProgress = payload.libraryProgress[b.id];
          if (remoteProgress && remoteProgress.lastReadAt > (b.progress?.lastReadAt || 0)) {
            return { ...b, progress: remoteProgress };
          }
          return b;
        })
      );
    });

    return unsubscribe;
  }, []);

  // Load bookmarks & highlights when active book changes
  useEffect(() => {
    if (activeBook) {
      getBookmarksForBook(activeBook.id).then(setBookmarks);
      getHighlightsForBook(activeBook.id).then(setHighlights);

      // Fetch file buffer if PDF
      if (activeBook.format === 'pdf') {
        getBookFileFromDB(activeBook.id).then((fileData) => {
          if (fileData instanceof ArrayBuffer) {
            setActiveFileBuffer(fileData);
          } else if (fileData instanceof Blob) {
            fileData.arrayBuffer().then(setActiveFileBuffer);
          }
        });
      }
    } else {
      setActiveFileBuffer(null);
      ttsReader.stop();
      setIsTTSPlaying(false);
    }
  }, [activeBook]);

  // Update Preferences Handler
  const handleUpdatePreferences = (updated: Partial<ReaderPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updated };
      savePreferencesToDB(next);
      return next;
    });
  };

  // Update Reading Progress
  const handleUpdateProgress = useCallback(async (
    chapterIndex: number,
    percentage: number,
    page: number = 1,
    totalPages: number = 1
  ) => {
    if (!activeBook) return;

    await updateReadingProgressInDB(activeBook.id, chapterIndex, percentage, page, totalPages);

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === activeBook.id) {
          const updatedProgress: ReadingProgress = {
            ...b.progress,
            bookId: b.id,
            currentChapterIndex: chapterIndex,
            currentPage: page,
            totalPages,
            percentage,
            lastReadAt: Date.now(),
            secondsRead: (b.progress?.secondsRead || 0) + 15,
          };
          return { ...b, progress: updatedProgress };
        }
        return b;
      })
    );

    // Auto-sync progress to cloud payload
    const progressMap: Record<string, ReadingProgress> = {};
    books.forEach((b) => {
      if (b.progress) progressMap[b.id] = b.progress;
    });
    pushToCloudSync(progressMap, bookmarks, highlights, preferences);
    setLastSyncTime(Date.now());
  }, [activeBook, books, bookmarks, highlights, preferences]);

  // Bookmarks Handlers
  const handleAddBookmark = async (
    title: string,
    excerpt: string,
    chapterIndex: number,
    progressPercent: number
  ) => {
    if (!activeBook) return;

    const newBookmark: Bookmark = {
      id: 'bm-' + Date.now(),
      bookId: activeBook.id,
      chapterIndex,
      progressPercent,
      title,
      excerpt,
      createdAt: Date.now(),
    };

    await saveBookmarkToDB(newBookmark);
    setBookmarks((prev) => [newBookmark, ...prev]);

    // Push cloud sync
    const progressMap: Record<string, ReadingProgress> = {};
    books.forEach((b) => {
      if (b.progress) progressMap[b.id] = b.progress;
    });
    pushToCloudSync(progressMap, [newBookmark, ...bookmarks], highlights, preferences);
    setLastSyncTime(Date.now());
  };

  const handleDeleteBookmark = async (id: string) => {
    await deleteBookmarkFromDB(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Highlights Handlers
  const handleAddHighlight = async (
    text: string,
    color: Highlight['color'],
    note?: string,
    chapterIndex: number = 0
  ) => {
    if (!activeBook) return;

    const newHighlight: Highlight = {
      id: 'hl-' + Date.now(),
      bookId: activeBook.id,
      chapterIndex,
      text,
      note,
      color,
      createdAt: Date.now(),
    };

    await saveHighlightToDB(newHighlight);
    setHighlights((prev) => [newHighlight, ...prev]);

    // Push cloud sync
    const progressMap: Record<string, ReadingProgress> = {};
    books.forEach((b) => {
      if (b.progress) progressMap[b.id] = b.progress;
    });
    pushToCloudSync(progressMap, bookmarks, [newHighlight, ...highlights], preferences);
    setLastSyncTime(Date.now());
  };

  const handleDeleteHighlight = async (id: string) => {
    await deleteHighlightFromDB(id);
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // Import Book File (EPUB, PDF, TXT, MD)
  const handleImportFile = async (file: File) => {
    setIsImporting(true);
    setImportError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileBuffer = await file.arrayBuffer();
      const bookId = 'book-' + Date.now();

      let newBook: Book;

      if (ext === 'epub') {
        const parsed = await parseEpubFile(fileBuffer, file.name);
        newBook = {
          id: bookId,
          title: parsed.title,
          author: parsed.author,
          description: parsed.description,
          format: 'epub',
          coverUrl: parsed.coverUrl,
          fileSize: file.size,
          dateAdded: Date.now(),
          isOfflineCached: true,
          chapters: parsed.chapters,
          progress: {
            bookId,
            currentChapterIndex: 0,
            currentPage: 1,
            totalPages: parsed.chapters.length,
            percentage: 0,
            lastReadAt: Date.now(),
            secondsRead: 0,
          },
        };
      } else if (ext === 'pdf') {
        newBook = {
          id: bookId,
          title: file.name.replace(/\.[^/.]+$/, ''),
          author: 'Document',
          description: 'Imported PDF document',
          format: 'pdf',
          fileSize: file.size,
          dateAdded: Date.now(),
          isOfflineCached: true,
          progress: {
            bookId,
            currentChapterIndex: 0,
            currentPage: 1,
            totalPages: 1,
            percentage: 0,
            lastReadAt: Date.now(),
            secondsRead: 0,
          },
        };
      } else if (ext === 'txt' || ext === 'md') {
        const textContent = new TextDecoder().decode(fileBuffer);
        const parsed = parsePlainTextOrMarkdown(textContent, file.name, ext as 'txt' | 'md');
        newBook = {
          id: bookId,
          title: parsed.title || file.name,
          author: parsed.author || 'Unknown',
          description: parsed.description,
          format: ext as 'txt' | 'md',
          fileSize: file.size,
          dateAdded: Date.now(),
          isOfflineCached: true,
          chapters: parsed.chapters,
          progress: {
            bookId,
            currentChapterIndex: 0,
            currentPage: 1,
            totalPages: parsed.chapters?.length || 1,
            percentage: 0,
            lastReadAt: Date.now(),
            secondsRead: 0,
          },
        };
      } else {
        throw new Error(`Unsupported format .${ext}. Please use .epub, .pdf, .txt, or .md`);
      }

      // Save to IndexedDB (with raw binary for PDF/EPUB)
      await saveBookToDB(newBook, fileBuffer);
      setBooks((prev) => [newBook, ...prev]);

      // Update storage estimate
      const estimate = await estimateStorageUsage();
      setStorageEstimate(estimate);

      // Automatically open imported book
      setActiveBook(newBook);
      if (newBook.format === 'pdf') {
        setActiveFileBuffer(fileBuffer);
      }
    } catch (err: unknown) {
      console.error('Import error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setImportError(msg);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    await deleteBookFromDB(bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (activeBook?.id === bookId) {
      setActiveBook(null);
    }
    const estimate = await estimateStorageUsage();
    setStorageEstimate(estimate);
  };

  const handleToggleOffline = async (book: Book) => {
    // Book is already cached in IndexedDB
    const updated = { ...book, isOfflineCached: !book.isOfflineCached };
    await saveBookToDB(updated);
    setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
  };

  // Manual Cloud Sync
  const handleTriggerManualSync = async () => {
    const progressMap: Record<string, ReadingProgress> = {};
    books.forEach((b) => {
      if (b.progress) progressMap[b.id] = b.progress;
    });

    const payload = pushToCloudSync(progressMap, bookmarks, highlights, preferences);
    setLastSyncTime(payload.timestamp);
    setDevices(getRegisteredDevices());
  };

  // Cloud Backup Export & Import
  const handleExportBackup = () => {
    const progressMap: Record<string, ReadingProgress> = {};
    books.forEach((b) => {
      if (b.progress) progressMap[b.id] = b.progress;
    });

    const payload: SyncDataPayload = {
      version: 1,
      timestamp: Date.now(),
      deviceId: 'lumina-backup',
      libraryProgress: progressMap,
      bookmarks,
      highlights,
      preferences,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-sync-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonString: string) => {
    try {
      const payload: SyncDataPayload = JSON.parse(jsonString);
      const localProgress: Record<string, ReadingProgress> = {};
      books.forEach((b) => {
        if (b.progress) localProgress[b.id] = b.progress;
      });

      const merged = mergeCloudSyncPayload(payload, localProgress, bookmarks, highlights);

      setBookmarks(merged.mergedBookmarks);
      setHighlights(merged.mergedHighlights);
      if (merged.remotePreferences) {
        setPreferences(merged.remotePreferences);
        savePreferencesToDB(merged.remotePreferences);
      }

      setBooks((prev) =>
        prev.map((b) => {
          const prog = merged.mergedProgress[b.id];
          return prog ? { ...b, progress: prog } : b;
        })
      );

      setLastSyncTime(Date.now());
      setIsSyncModalOpen(false);
    } catch {
      alert('Invalid backup file format.');
    }
  };

  // Text-To-Speech Narrator Toggle
  const handleToggleTTS = () => {
    if (!activeBook) return;

    if (isTTSPlaying) {
      ttsReader.stop();
      setIsTTSPlaying(false);
    } else {
      // Read current chapter or page text
      const chapter = activeBook.chapters?.[activeBook.progress?.currentChapterIndex || 0];
      const textToRead = chapter ? chapter.content : 'Document content';

      ttsReader.speak(
        textToRead,
        preferences.speechRate,
        preferences.speechPitch,
        undefined,
        () => setIsTTSPlaying(false)
      );
      setIsTTSPlaying(true);
    }
  };

  return (
    <div 
      id="lumina-app"
      className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none font-sans"
    >
      {/* 1. Native Windows 10/11 Fluent Titlebar */}
      <WindowsTitleBar
        currentBookTitle={activeBook?.title}
        isReading={!!activeBook}
        onBackToLibrary={() => {
          ttsReader.stop();
          setIsTTSPlaying(false);
          setActiveBook(null);
        }}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isTTSPlaying={isTTSPlaying}
        onToggleTTS={handleToggleTTS}
        isOffline={isOffline}
        lastSyncTime={lastSyncTime}
      />

      {/* 2. Main Viewport: Either Library View or Active Reader View */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {!activeBook ? (
          <LibraryView
            books={books}
            onOpenBook={(book) => setActiveBook(book)}
            onImportFile={handleImportFile}
            onDeleteBook={handleDeleteBook}
            onToggleOffline={handleToggleOffline}
            isImporting={isImporting}
            importError={importError}
            storageUsage={storageEstimate}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            onOpenSync={() => setIsSyncModalOpen(true)}
          />
        ) : (
          <ReaderView
            book={activeBook}
            fileBuffer={activeFileBuffer}
            preferences={preferences}
            bookmarks={bookmarks}
            highlights={highlights}
            onUpdateProgress={handleUpdateProgress}
            onAddBookmark={handleAddBookmark}
            onAddHighlight={handleAddHighlight}
            onOpenTableOfContents={() => setIsTocOpen(true)}
            onOpenBookmarks={() => setIsBookmarksOpen(true)}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            isTTSPlaying={isTTSPlaying}
            onToggleTTS={handleToggleTTS}
          />
        )}
      </main>

      {/* 3. Frosted Glass & Themes Customization Panel */}
      <FrostedThemePanel
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onChange={handleUpdatePreferences}
      />

      {/* 4. Cross-Device Cloud Sync Manager Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        devices={devices}
        lastSyncTime={lastSyncTime}
        onTriggerManualSync={handleTriggerManualSync}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        offlineStorageEstimate={storageEstimate}
      />

      {/* 5. Table of Contents Drawer */}
      {activeBook && (
        <TableOfContentsModal
          isOpen={isTocOpen}
          onClose={() => setIsTocOpen(false)}
          chapters={activeBook.chapters || []}
          currentChapterIndex={activeBook.progress?.currentChapterIndex || 0}
          onSelectChapter={(index) => {
            const total = activeBook.chapters?.length || 1;
            const pct = Math.round(((index + 1) / total) * 100);
            handleUpdateProgress(index, pct, index + 1, total);
          }}
        />
      )}

      {/* 6. Bookmarks & Highlights Drawer */}
      {activeBook && (
        <BookmarksNotesDrawer
          isOpen={isBookmarksOpen}
          onClose={() => setIsBookmarksOpen(false)}
          bookmarks={bookmarks}
          highlights={highlights}
          currentChapterIndex={activeBook.progress?.currentChapterIndex || 0}
          onJumpToBookmark={(bm) => {
            const total = activeBook.chapters?.length || 1;
            handleUpdateProgress(bm.chapterIndex, bm.progressPercent, bm.chapterIndex + 1, total);
          }}
          onJumpToHighlight={(hl) => {
            const total = activeBook.chapters?.length || 1;
            const pct = Math.round(((hl.chapterIndex + 1) / total) * 100);
            handleUpdateProgress(hl.chapterIndex, pct, hl.chapterIndex + 1, total);
          }}
          onDeleteBookmark={handleDeleteBookmark}
          onDeleteHighlight={handleDeleteHighlight}
          onAddBookmark={() => {
            const chaps = activeBook.chapters || [];
            const idx = activeBook.progress?.currentChapterIndex || 0;
            const title = chaps[idx]?.title || `Chapter ${idx + 1}`;
            const excerpt = chaps[idx]?.content.replace(/<[^>]*>?/gm, ' ').substring(0, 120) || 'Bookmark';
            const pct = Math.round(((idx + 1) / (chaps.length || 1)) * 100);
            handleAddBookmark(title, excerpt, idx, pct);
          }}
        />
      )}

      {/* 7. In-Book Search Modal */}
      {activeBook && (
        <BookSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          chapters={activeBook.chapters || []}
          onSelectResult={(chapterIndex) => {
            const total = activeBook.chapters?.length || 1;
            const pct = Math.round(((chapterIndex + 1) / total) * 100);
            handleUpdateProgress(chapterIndex, pct, chapterIndex + 1, total);
          }}
        />
      )}
    </div>
  );
}
