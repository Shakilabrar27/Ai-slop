import React, { useState } from 'react';
import { 
  Cloud, 
  CloudCheck, 
  Download, 
  Moon, 
  Palette, 
  Search, 
  Sliders, 
  Wifi, 
  WifiOff,
  BookOpen,
  Volume2,
  VolumeX,
  Maximize,
  Minimize2,
  ArrowLeft
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WindowsTitleBarProps {
  currentBookTitle?: string;
  isReading: boolean;
  onBackToLibrary: () => void;
  onOpenPreferences: () => void;
  onOpenSync: () => void;
  onOpenSearch: () => void;
  isTTSPlaying?: boolean;
  onToggleTTS?: () => void;
  isOffline: boolean;
  lastSyncTime?: number;
}

export const WindowsTitleBar: React.FC<WindowsTitleBarProps> = ({
  currentBookTitle,
  isReading,
  onBackToLibrary,
  onOpenPreferences,
  onOpenSync,
  onOpenSearch,
  isTTSPlaying = false,
  onToggleTTS,
  isOffline,
  lastSyncTime,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimizedNotification, setIsMinimizedNotification] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimizedNotification(true);
    setTimeout(() => setIsMinimizedNotification(false), 2500);
  };

  const handleClose = () => {
    if (isReading) {
      onBackToLibrary();
    } else {
      // In web environment, notify user or collapse
      setIsMinimizedNotification(true);
      setTimeout(() => setIsMinimizedNotification(false), 2500);
    }
  };

  const formatLastSync = (timestamp?: number) => {
    if (!timestamp) return 'Cloud Synced';
    const diffMins = Math.floor((Date.now() - timestamp) / 60000);
    if (diffMins < 1) return 'Synced just now';
    if (diffMins < 60) return `Synced ${diffMins}m ago`;
    return 'Cloud Synced';
  };

  return (
    <div 
      id="windows-titlebar"
      className="relative z-50 flex items-center justify-between h-9 px-2 bg-slate-950/80 backdrop-blur-md border-b border-white/10 select-none text-xs text-slate-300"
    >
      {/* Left: Windows App Icon & Navigation */}
      <div className="flex items-center gap-2 overflow-hidden pr-2">
        {isReading ? (
          <button
            onClick={onBackToLibrary}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-slate-200 transition-colors"
            title="Return to Library (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium text-xs hidden sm:inline">Library</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 pl-1">
            <img src="/icon.svg" alt="Corn Reader Icon" className="w-4 h-4 rounded-sm" />
            <span className="font-semibold text-slate-100 tracking-tight">Corn Reader</span>
          </div>
        )}

        {/* Book Title when reading */}
        {isReading && (
          <>
            <div className="h-3.5 w-px bg-white/15 hidden sm:block" />
            <span className="text-slate-400 truncate text-[11px] max-w-[200px] sm:max-w-[320px] md:max-w-[480px]">
              {currentBookTitle || 'Reading Document'}
            </span>
          </>
        )}
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-1">
        {/* Offline Badge */}
        <div 
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
            isOffline 
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
              : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
          }`}
          title={isOffline ? 'Offline Mode active. Reading uninterrupted from local cache.' : 'Connected to network. Cloud sync enabled.'}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Offline Mode</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">Online</span>
            </>
          )}
        </div>

        {/* Cloud Sync Button */}
        <button
          onClick={onOpenSync}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-slate-300 hover:text-sky-300 transition-colors"
          title="Cloud Sync Manager across all devices"
        >
          <Cloud className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden lg:inline text-[11px]">{formatLastSync(lastSyncTime)}</span>
        </button>

        {/* Text-To-Speech Narrator Toggle */}
        {isReading && onToggleTTS && (
          <button
            onClick={onToggleTTS}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              isTTSPlaying ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 animate-pulse' : 'hover:bg-white/10 text-slate-300'
            }`}
            title={isTTSPlaying ? 'Pause Narrator' : 'Read Aloud with Text-To-Speech'}
          >
            {isTTSPlaying ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline text-[11px]">{isTTSPlaying ? 'Reading' : 'Read Aloud'}</span>
          </button>
        )}

        {/* In-Book Search Button */}
        {isReading && (
          <button
            onClick={onOpenSearch}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Search in book (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Appearance / Frosted Glass Themes Button */}
        <button
          onClick={onOpenPreferences}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 text-slate-300 hover:text-sky-300 transition-colors"
          title="Custom Appearance & Frosted Glass Themes (Ctrl+,)"
        >
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline text-[11px]">Themes & Fonts</span>
        </button>

        {/* Install on Windows Button (PWA) */}
        {isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-[11px] shadow-sm transition-colors"
            title="Install Corn Reader"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* Standard Windows Window Controls: Minimize, Maximize, Close */}
        <div className="flex items-center ml-1 pl-1 border-l border-white/10">
          {/* Minimize */}
          <button
            onClick={handleMinimize}
            className="windows-titlebar-btn w-9 h-9 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-slate-100"
            title="Minimize"
          >
            <span className="w-2.5 h-[1.5px] bg-current inline-block" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={toggleFullscreen}
            className="windows-titlebar-btn w-9 h-9 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-slate-100"
            title={isFullscreen ? 'Restore Window (F11)' : 'Maximize (F11)'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <div className="w-2.5 h-2.5 border-[1.5px] border-current" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="windows-titlebar-btn w-9 h-9 flex items-center justify-center hover:bg-red-600 text-slate-400 hover:text-white"
            title={isReading ? 'Exit Book' : 'Close Application'}
          >
            <span className="text-sm font-light leading-none">✕</span>
          </button>
        </div>
      </div>

      {/* Minimized Toast Notification */}
      {isMinimizedNotification && (
        <div className="absolute top-11 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-slate-900/95 border border-sky-500/30 rounded-lg shadow-xl text-slate-200 text-xs backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span>Corn Reader is running in active background mode.</span>
        </div>
      )}
    </div>
  );
};
