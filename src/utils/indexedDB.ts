import { Book, Bookmark, Highlight, ReaderPreferences } from '../types';

const DB_NAME = 'lumina_ebook_reader_db';
const DB_VERSION = 2;

const STORE_BOOKS = 'books';
const STORE_BOOKMARKS = 'bookmarks';
const STORE_HIGHLIGHTS = 'highlights';
const STORE_SETTINGS = 'settings';
const STORE_FILES = 'book_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_BOOKS)) {
        db.createObjectStore(STORE_BOOKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        const store = db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'id' });
        store.createIndex('bookId', 'bookId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_HIGHLIGHTS)) {
        const store = db.createObjectStore(STORE_HIGHLIGHTS, { keyPath: 'id' });
        store.createIndex('bookId', 'bookId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES, { keyPath: 'bookId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBookToDB(book: Book, rawData?: ArrayBuffer | Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_BOOKS, STORE_FILES], 'readwrite');
    const bookStore = tx.objectStore(STORE_BOOKS);
    const fileStore = tx.objectStore(STORE_FILES);

    // Clone book metadata without rawBlob to keep object lightweight
    const { rawBlob: _ignored, ...bookMeta } = book;
    bookMeta.isOfflineCached = true;
    bookStore.put(bookMeta);

    if (rawData) {
      fileStore.put({ bookId: book.id, data: rawData, format: book.format });
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBookFromDB(id: string): Promise<Book | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readonly');
    const store = tx.objectStore(STORE_BOOKS);
    const req = store.get(id);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllBooksFromDB(): Promise<Book[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readonly');
    const store = tx.objectStore(STORE_BOOKS);
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getBookFileFromDB(bookId: string): Promise<ArrayBuffer | Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, 'readonly');
    const store = tx.objectStore(STORE_FILES);
    const req = store.get(bookId);

    req.onsuccess = () => {
      if (req.result && req.result.data) {
        resolve(req.result.data);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteBookFromDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_BOOKS, STORE_FILES, STORE_BOOKMARKS, STORE_HIGHLIGHTS], 'readwrite');
    tx.objectStore(STORE_BOOKS).delete(id);
    tx.objectStore(STORE_FILES).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateReadingProgressInDB(
  bookId: string,
  chapterIndex: number,
  percentage: number,
  page: number = 1,
  totalPages: number = 1
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const req = store.get(bookId);

    req.onsuccess = () => {
      const book: Book = req.result;
      if (book) {
        book.progress = {
          ...book.progress,
          bookId,
          currentChapterIndex: chapterIndex,
          currentPage: page,
          totalPages,
          percentage: Math.min(100, Math.max(0, Math.round(percentage))),
          lastReadAt: Date.now(),
          secondsRead: (book.progress?.secondsRead || 0) + 15,
        };
        store.put(book);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBookmarksForBook(bookId: string): Promise<Bookmark[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKMARKS, 'readonly');
    const index = tx.objectStore(STORE_BOOKMARKS).index('bookId');
    const req = index.getAll(bookId);

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveBookmarkToDB(bookmark: Bookmark): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
    tx.objectStore(STORE_BOOKMARKS).put(bookmark);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteBookmarkFromDB(bookmarkId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
    tx.objectStore(STORE_BOOKMARKS).delete(bookmarkId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getHighlightsForBook(bookId: string): Promise<Highlight[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HIGHLIGHTS, 'readonly');
    const index = tx.objectStore(STORE_HIGHLIGHTS).index('bookId');
    const req = index.getAll(bookId);

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveHighlightToDB(highlight: Highlight): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HIGHLIGHTS, 'readwrite');
    tx.objectStore(STORE_HIGHLIGHTS).put(highlight);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteHighlightFromDB(highlightId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HIGHLIGHTS, 'readwrite');
    tx.objectStore(STORE_HIGHLIGHTS).delete(highlightId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function savePreferencesToDB(prefs: ReaderPreferences): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, 'readwrite');
    tx.objectStore(STORE_SETTINGS).put(prefs, 'reader_preferences');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPreferencesFromDB(): Promise<ReaderPreferences | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, 'readonly');
    const req = tx.objectStore(STORE_SETTINGS).get('reader_preferences');
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function estimateStorageUsage(): Promise<{ usedBytes: number; quotaBytes: number }> {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return {
      usedBytes: estimate.usage || 0,
      quotaBytes: estimate.quota || 0,
    };
  }
  return { usedBytes: 0, quotaBytes: 0 };
}
