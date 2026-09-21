export type BookFormat = 'epub' | 'pdf' | 'txt' | 'md';

export interface Chapter {
  id: string;
  title: string;
  content: string; // HTML or text
  href?: string;
  wordCount?: number;
  pageNumber?: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterIndex: number;
  progressPercent: number;
  title: string;
  excerpt: string;
  createdAt: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterIndex: number;
  text: string;
  note?: string;
  color: 'yellow' | 'green' | 'pink' | 'blue' | 'purple';
  createdAt: number;
}

export interface ReadingProgress {
  bookId: string;
  currentChapterIndex: number;
  currentPage: number; // for PDF or paginated
  totalPages: number;
  percentage: number;
  lastReadAt: number;
  secondsRead: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  format: BookFormat;
  coverUrl?: string;
  fileSize: number; // in bytes
  dateAdded: number;
  progress: ReadingProgress;
  chapters?: Chapter[];
  isOfflineCached: boolean;
  rawBlob?: Blob; // stored in IndexedDB
  pdfDataUrl?: string;
}

export type ThemeId = 'frosted-glass' | 'oled-black' | 'slate-dark' | 'warm-sepia' | 'paper-white' | 'solarized-amber';

export type GlassTint = 'windows-mica' | 'ice-blue' | 'rose-quartz' | 'emerald-fog' | 'obsidian-smoke';

export type FontFamily = 
  | 'Segoe UI, system-ui, sans-serif'
  | 'Merriweather, serif'
  | 'Literata, serif'
  | 'Georgia, serif'
  | 'Atkinson Hyperlegible, sans-serif'
  | 'Plus Jakarta Sans, sans-serif'
  | 'JetBrains Mono, monospace';

export type ReadingLayout = 'single' | 'dual' | 'scroll';

export type TextAlignment = 'left' | 'justify' | 'center';

export interface ReaderPreferences {
  theme: ThemeId;
  glassTint: GlassTint;
  glassOpacity: number; // 0.3 to 0.95
  fontSize: number; // 12 to 38
  fontFamily: FontFamily;
  lineHeight: number; // 1.3 to 2.4
  letterSpacing: number; // -0.02 to 0.08
  paragraphSpacing: number; // 0.5 to 2.0
  textAlign: TextAlignment;
  maxWidth: number; // 600 to 1200
  layout: ReadingLayout;
  bionicReading: boolean;
  brightness: number; // 50 to 100
  speechRate: number; // 0.8 to 2.0
  speechPitch: number;
}

export interface SyncDevice {
  id: string;
  name: string;
  platform: 'windows' | 'surface' | 'mobile' | 'tablet' | 'web';
  lastActive: number;
  isCurrent: boolean;
  ipLocation?: string;
}

export interface SyncDataPayload {
  version: number;
  timestamp: number;
  deviceId: string;
  libraryProgress: Record<string, ReadingProgress>;
  bookmarks: Bookmark[];
  highlights: Highlight[];
  preferences: ReaderPreferences;
}
