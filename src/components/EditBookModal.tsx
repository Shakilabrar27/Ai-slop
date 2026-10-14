import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  FolderPlus, 
  Sparkles, 
  Trash2, 
  Check, 
  Palette, 
  BookOpen, 
  Link as LinkIcon, 
  Plus, 
  Edit2
} from 'lucide-react';
import { Book } from '../types';
import { PRESET_COVERS, generateCustomCoverUrl } from '../data/bookCovers';

interface EditBookModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onSave: (updatedBook: Book) => void;
  existingCategories?: string[];
  existingTags?: string[];
}

const DEFAULT_POPULAR_CATEGORIES = [
  'Classic Literature',
  'Sci-Fi',
  'Fantasy',
  'Fiction',
  'Non-Fiction',
  'Mystery & Thriller',
  'Philosophy',
  'History',
  'Biography',
  'Technology & Code',
  'Guides',
  'Poetry',
  'Self-Improvement'
];

const SUGGESTED_TAGS = [
  'Favorite',
  'To Read',
  'In Progress',
  'Finished',
  'Classic',
  'Gothic',
  'Masterpiece',
  'Adventure',
  'Reference',
  'Recommended',
  'Audiobook',
  'Study'
];

export const EditBookModal: React.FC<EditBookModalProps> = ({
  isOpen,
  book,
  onClose,
  onSave,
  existingCategories = [],
  existingTags = []
}) => {
  if (!isOpen || !book) return null;

  // Local editing state
  const [title, setTitle] = useState(book.title || '');
  const [author, setAuthor] = useState(book.author || '');
  const [description, setDescription] = useState(book.description || '');
  const [coverUrl, setCoverUrl] = useState<string | undefined>(book.coverUrl);
  const [category, setCategory] = useState<string>(book.category || 'General');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  
  // Tags state
  const [tags, setTags] = useState<string[]>(book.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');

  // Cover image mode tab: 'upload' | 'url' | 'presets' | 'generator'
  const [coverTab, setCoverTab] = useState<'upload' | 'url' | 'presets' | 'generator'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [generatorTheme, setGeneratorTheme] = useState<'sky' | 'rose' | 'amber' | 'emerald' | 'purple'>('sky');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine unique categories
  const allCategories = Array.from(
    new Set([...DEFAULT_POPULAR_CATEGORIES, ...existingCategories, ...(category ? [category] : [])])
  );

  // Combine suggested tags
  const availableSuggestedTags = Array.from(
    new Set([...SUGGESTED_TAGS, ...existingTags])
  ).filter((t) => !tags.includes(t));

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setCoverUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle applying image URL
  const handleApplyImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setCoverUrl(imageUrlInput.trim());
    setImageUrlInput('');
  };

  // Handle generating custom cover
  const handleGenerateCover = () => {
    const generated = generateCustomCoverUrl(title, author, generatorTheme);
    setCoverUrl(generated);
  };

  // Handle adding tag
  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd !== undefined ? tagToAdd : newTagInput).trim();
    if (!val) return;
    if (!tags.includes(val)) {
      setTags([...tags, val]);
    }
    setNewTagInput('');
  };

  // Handle removing tag
  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  // Start editing a tag
  const handleStartEditTag = (index: number) => {
    setEditingTagIndex(index);
    setEditingTagValue(tags[index]);
  };

  // Save edited tag
  const handleSaveEditedTag = () => {
    if (editingTagIndex === null) return;
    const trimmed = editingTagValue.trim();
    if (trimmed) {
      const nextTags = [...tags];
      nextTags[editingTagIndex] = trimmed;
      setTags(nextTags);
    } else {
      handleRemoveTag(editingTagIndex);
    }
    setEditingTagIndex(null);
    setEditingTagValue('');
  };

  // Handle add custom category
  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (trimmed) {
      setCategory(trimmed);
      setCustomCategoryInput('');
      setIsAddingCustomCategory(false);
    }
  };

  // Save all changes
  const handleSave = () => {
    const updatedBook: Book = {
      ...book,
      title: title.trim() || 'Untitled Book',
      author: author.trim() || 'Unknown Author',
      description: description.trim() || undefined,
      coverUrl: coverUrl,
      category: category.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };
    onSave(updatedBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900/95 border border-white/15 shadow-2xl shadow-black/80 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>Edit Book Details & Metadata</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-normal uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {book.format}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Update title, author, 3:2 portrait cover artwork, category, and tags</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: 3:2 Portrait Cover Photo & Preview (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Cover Artwork</span>
                  <span className="text-[11px] text-sky-400 font-mono">3:2 Aspect Ratio</span>
                </label>

                {/* 3:2 Aspect Ratio Container */}
                <div className="relative w-full aspect-[2/3] max-w-[240px] mx-auto rounded-xl overflow-hidden bg-slate-800 border-2 border-white/15 shadow-xl group">
                  {coverUrl ? (
                    <img 
                      src={coverUrl} 
                      alt="Book Cover Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-4 flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
                      <p className="text-xs font-medium text-slate-300">{title || 'Untitled Book'}</p>
                      <p className="text-[11px] text-sky-400 mt-1">{author || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-500 mt-4">No custom cover assigned</p>
                    </div>
                  )}

                  {/* Left Spine Overlay Effect */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Clear Cover Button */}
                  {coverUrl && (
                    <button
                      onClick={() => setCoverUrl(undefined)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-900/80 text-rose-300 border border-white/20 backdrop-blur-xs transition-colors shadow-lg"
                      title="Remove Cover Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cover Source Selector Tabs */}
              <div className="space-y-3 pt-1">
                <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setCoverTab('upload')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                      coverTab === 'upload' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverTab('presets')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                      coverTab === 'presets' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverTab('generator')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                      coverTab === 'generator' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Design
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverTab('url')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                      coverTab === 'url' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    URL
                  </button>
                </div>

                {/* Tab: Upload Local File */}
                {coverTab === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 font-medium text-xs transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Image from Computer...</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      PNG, JPG, WebP, or SVG. Saved offline in IndexedDB.
                    </p>
                  </div>
                )}

                {/* Tab: Preset Art Gallery */}
                {coverTab === 'presets' && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_COVERS.map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => setCoverUrl(preset.coverUrl)}
                          className={`cursor-pointer group relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all ${
                            coverUrl === preset.coverUrl
                              ? 'border-sky-400 shadow-md shadow-sky-500/20 scale-102'
                              : 'border-white/10 hover:border-white/40'
                          }`}
                          title={preset.name}
                        >
                          <img src={preset.coverUrl} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white text-center p-1">
                            {preset.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Cover Generator */}
                {coverTab === 'generator' && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/10 space-y-2.5">
                    <span className="text-[11px] text-slate-300 font-medium block">Color Theme:</span>
                    <div className="flex gap-2">
                      {(['sky', 'rose', 'amber', 'emerald', 'purple'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setGeneratorTheme(t)}
                          className={`flex-1 py-1 rounded text-[11px] font-semibold capitalize border transition-all ${
                            generatorTheme === t
                              ? 'bg-white/20 border-sky-400 text-white'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateCover}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Matching Cover</span>
                    </button>
                  </div>
                )}

                {/* Tab: URL */}
                {coverTab === 'url' && (
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        placeholder="https://example.com/cover.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyImageUrl}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">Paste direct image web link</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Title, Author, Category, Tags, Description (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Book Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Book Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Author Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
                />
              </div>

              {/* Category Section */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderPlus className="w-3.5 h-3.5 text-sky-400" />
                    <span>Category</span>
                  </label>
                  {!isAddingCustomCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomCategory(true)}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Category</span>
                    </button>
                  )}
                </div>

                {!isAddingCustomCategory ? (
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <div className="px-3 py-2 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-medium flex items-center gap-1.5">
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>{category || 'None'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Type custom category name..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/20 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
                    >
                      Set
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomCategory(false)}
                      className="px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-white/10 space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tags ({tags.length})</span>
                </label>

                {/* Active Tags list */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-slate-900/60 border border-white/10">
                  {tags.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No tags added yet. Choose suggestions below or type a tag.</span>
                  ) : (
                    tags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all"
                      >
                        {editingTagIndex === idx ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingTagValue}
                              onChange={(e) => setEditingTagValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEditedTag();
                                if (e.key === 'Escape') setEditingTagIndex(null);
                              }}
                              className="w-20 px-1 py-0.5 rounded bg-black/60 border border-cyan-400 text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={handleSaveEditedTag}
                              className="text-emerald-400 hover:text-emerald-300"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span 
                              onClick={() => handleStartEditTag(idx)}
                              className="cursor-pointer"
                              title="Click to rename tag"
                            >
                              #{tag}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditTag(idx)}
                              className="opacity-0 group-hover:opacity-100 text-cyan-400 hover:text-white transition-opacity"
                              title="Edit tag text"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(idx)}
                              className="text-cyan-400 hover:text-rose-400 transition-colors ml-0.5"
                              title="Remove tag"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Tag Input */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Add a new tag (e.g. Science, Favorite)..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tag</span>
                  </button>
                </div>

                {/* Quick Suggested Tags */}
                {availableSuggestedTags.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      Quick Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {availableSuggestedTags.slice(0, 8).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleAddTag(st)}
                          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 text-[11px] transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>{st}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Book Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Synopsis
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter book description or summary..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none leading-relaxed"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-900/90">
          <div className="text-xs text-slate-400">
            Changes are saved immediately to local IndexedDB and sync across devices.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all hover:scale-102 active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Save Book Details</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
