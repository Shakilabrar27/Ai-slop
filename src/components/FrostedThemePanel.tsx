import React from 'react';
import { 
  X, 
  Type, 
  Sparkles, 
  Eye, 
  Columns, 
  FileText, 
  Scroll, 
  AlignLeft, 
  AlignJustify, 
  AlignCenter, 
  Sun, 
  Moon, 
  Droplet,
  Check
} from 'lucide-react';
import { FontFamily, GlassTint, ReaderPreferences, ReadingLayout, TextAlignment, ThemeId } from '../types';

interface FrostedThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ReaderPreferences;
  onChange: (updated: Partial<ReaderPreferences>) => void;
}

const THEME_OPTIONS: { id: ThemeId; name: string; desc: string; bgClass: string; textClass: string; isGlass?: boolean }[] = [
  {
    id: 'frosted-glass',
    name: 'Frosted Glass (Mica)',
    desc: 'Fluent Acrylic glass with luminous blur',
    bgClass: 'bg-slate-900/60 backdrop-blur-xl border-sky-400/40 text-slate-100 shadow-sky-950/50',
    textClass: 'text-slate-100',
    isGlass: true,
  },
  {
    id: 'slate-dark',
    name: 'Windows 11 Dark',
    desc: 'Balanced deep slate dark mode',
    bgClass: 'bg-slate-900 border-slate-700 text-slate-200',
    textClass: 'text-slate-200',
  },
  {
    id: 'oled-black',
    name: 'OLED Pitch Black',
    desc: 'Zero-power pure black for night reading',
    bgClass: 'bg-black border-zinc-800 text-zinc-100',
    textClass: 'text-zinc-100',
  },
  {
    id: 'warm-sepia',
    name: 'Vintage Sepia',
    desc: 'Warm paper tint reducing eye strain',
    bgClass: 'bg-[#f4ecd8] border-[#e2d5b5] text-[#42331f]',
    textClass: 'text-[#42331f]',
  },
  {
    id: 'solarized-amber',
    name: 'Solarized Amber',
    desc: 'Nighttime low-blue-light palette',
    bgClass: 'bg-[#1b1916] border-[#383127] text-[#e89d44]',
    textClass: 'text-[#e89d44]',
  },
  {
    id: 'paper-white',
    name: 'Pure Daylight',
    desc: 'Crisp high-contrast daylight view',
    bgClass: 'bg-white border-slate-200 text-slate-900',
    textClass: 'text-slate-900',
  },
];

const GLASS_TINTS: { id: GlassTint; name: string; color: string; sample: string }[] = [
  { id: 'windows-mica', name: 'Mica Classic', color: 'rgba(30, 41, 59, 0.7)', sample: 'from-slate-800 to-slate-900' },
  { id: 'ice-blue', name: 'Nordic Frost', color: 'rgba(12, 74, 110, 0.65)', sample: 'from-sky-900 to-cyan-950' },
  { id: 'obsidian-smoke', name: 'Obsidian Smoke', color: 'rgba(15, 15, 18, 0.8)', sample: 'from-zinc-900 to-black' },
  { id: 'emerald-fog', name: 'Emerald Aurora', color: 'rgba(6, 78, 59, 0.65)', sample: 'from-emerald-950 to-teal-950' },
  { id: 'rose-quartz', name: 'Amethyst Dusk', color: 'rgba(88, 28, 135, 0.65)', sample: 'from-purple-950 to-pink-950' },
];

const FONT_FAMILIES: { value: FontFamily; label: string; preview: string }[] = [
  { value: 'Segoe UI, system-ui, sans-serif', label: 'Segoe UI (Windows Native)', preview: 'The quick brown fox' },
  { value: 'Merriweather, serif', label: 'Merriweather (Classic Book Serif)', preview: 'The quick brown fox' },
  { value: 'Literata, serif', label: 'Literata (Contemporary Editorial)', preview: 'The quick brown fox' },
  { value: 'Georgia, serif', label: 'Georgia (Refined Print Serif)', preview: 'The quick brown fox' },
  { value: 'Atkinson Hyperlegible, sans-serif', label: 'Atkinson (Dyslexia Friendly)', preview: 'The quick brown fox' },
  { value: 'Plus Jakarta Sans, sans-serif', label: 'Plus Jakarta (Clean Geometric)', preview: 'The quick brown fox' },
  { value: 'JetBrains Mono, monospace', label: 'JetBrains Mono (Technical / Code)', preview: 'The quick brown fox' },
];

export const FrostedThemePanel: React.FC<FrostedThemePanelProps> = ({
  isOpen,
  onClose,
  preferences,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900/90 text-slate-100 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Display & Reading Preferences</h2>
              <p className="text-xs text-slate-400">Windows Fluent themes, typography & frosted glass</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* 1. Theme Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Theme & Background Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = preferences.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onChange({ theme: theme.id })}
                    className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'border-sky-400 ring-2 ring-sky-400/30 shadow-lg' 
                        : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                    } ${theme.bgClass}`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <span className="font-medium text-xs truncate max-w-[130px]">{theme.name}</span>
                    <span className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{theme.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Frosted Glass Customization (If Frosted Glass is active) */}
          {preferences.theme === 'frosted-glass' && (
            <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/25 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-medium text-xs">
                  <Droplet className="w-4 h-4" />
                  <span>Windows Acrylic Frosted Glass Controls</span>
                </div>
                <span className="text-xs text-sky-300 font-mono">
                  {Math.round(preferences.glassOpacity * 100)}% Opacity
                </span>
              </div>

              {/* Glass Tint Selector */}
              <div>
                <span className="text-xs text-slate-300 mb-2 block">Acrylic Tint Color</span>
                <div className="grid grid-cols-5 gap-2">
                  {GLASS_TINTS.map((tint) => (
                    <button
                      key={tint.id}
                      onClick={() => onChange({ glassTint: tint.id })}
                      className={`h-8 rounded-lg border flex items-center justify-center text-xs font-medium transition-all bg-gradient-to-br ${tint.sample} ${
                        preferences.glassTint === tint.id
                          ? 'border-sky-400 ring-2 ring-sky-400/40'
                          : 'border-white/15 opacity-70 hover:opacity-100'
                      }`}
                      title={tint.name}
                    >
                      {preferences.glassTint === tint.id && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glass Translucency Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Subtle Frost (Light Blur)</span>
                  <span>Deep Acrylic (Dense)</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.95"
                  step="0.05"
                  value={preferences.glassOpacity}
                  onChange={(e) => onChange({ glassOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 3. Typography & Font Sizing */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Typography & Font Sizing
            </label>

            {/* Font Size Stepper & Slider */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Font Size</span>
                <span className="font-mono text-sky-400 font-semibold">{preferences.fontSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onChange({ fontSize: Math.max(12, preferences.fontSize - 2) })}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-base font-bold transition-colors"
                  title="Decrease font size"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="12"
                  max="38"
                  step="1"
                  value={preferences.fontSize}
                  onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
                  className="flex-1 accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => onChange({ fontSize: Math.min(38, preferences.fontSize + 2) })}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-base font-bold transition-colors"
                  title="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Font Family Picker */}
            <div>
              <span className="text-xs text-slate-300 mb-2 block">Typeface Family</span>
              <div className="space-y-1.5">
                {FONT_FAMILIES.map((font) => {
                  const isSelected = preferences.fontFamily === font.value;
                  return (
                    <button
                      key={font.value}
                      onClick={() => onChange({ fontFamily: font.value })}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-sky-400/80 bg-sky-500/15 text-white'
                          : 'border-white/10 hover:border-white/20 bg-white/5 text-slate-300'
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      <span className="text-xs font-medium">{font.label}</span>
                      <span className="text-xs text-slate-400">{font.preview}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Page Layout & Alignment */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Page Spread & Text Formatting
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChange({ layout: 'single' })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  preferences.layout === 'single'
                    ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                    : 'border-white/10 hover:bg-white/5 text-slate-400'
                }`}
              >
                <FileText className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-medium">Single Page</span>
              </button>

              <button
                onClick={() => onChange({ layout: 'dual' })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  preferences.layout === 'dual'
                    ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                    : 'border-white/10 hover:bg-white/5 text-slate-400'
                }`}
              >
                <Columns className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-medium">Dual Book View</span>
              </button>

              <button
                onClick={() => onChange({ layout: 'scroll' })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  preferences.layout === 'scroll'
                    ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                    : 'border-white/10 hover:bg-white/5 text-slate-400'
                }`}
              >
                <Scroll className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-medium">Continuous</span>
              </button>
            </div>

            {/* Alignment & Line Spacing */}
            <div className="grid grid-cols-2 gap-3">
              {/* Text Alignment */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400 block mb-2">Alignment</span>
                <div className="flex gap-1">
                  {(['left', 'justify', 'center'] as TextAlignment[]).map((align) => (
                    <button
                      key={align}
                      onClick={() => onChange({ textAlign: align })}
                      className={`flex-1 py-1.5 rounded flex items-center justify-center text-xs transition-colors ${
                        preferences.textAlign === align
                          ? 'bg-sky-500 text-white font-medium'
                          : 'hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                      {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
                      {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Line Height</span>
                  <span className="text-sky-400 font-mono">{preferences.lineHeight}x</span>
                </div>
                <div className="flex gap-1">
                  {[1.3, 1.5, 1.8, 2.2].map((lh) => (
                    <button
                      key={lh}
                      onClick={() => onChange({ lineHeight: lh })}
                      className={`flex-1 py-1 rounded text-xs transition-colors ${
                        preferences.lineHeight === lh
                          ? 'bg-sky-500 text-white font-medium'
                          : 'hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      {lh}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bionic Reading Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Bionic Reading Fixation</span>
                <span className="text-[11px] text-slate-400">Emphasize initial word characters to speed up reading</span>
              </div>
              <button
                onClick={() => onChange({ bionicReading: !preferences.bionicReading })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  preferences.bionicReading ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    preferences.bionicReading ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
