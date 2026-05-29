'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

export function FileDropzone({
  accept = '.pdf,image/*',
  onFileSelect,
  label = 'Upload a file',
  hint = 'PDF, JPEG, or PNG up to 50MB',
  disabled = false,
  file = null,
  onClear,
  id = 'file-dropzone',
}) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) onFileSelect(droppedFile);
    },
    [disabled, onFileSelect]
  );

  const handleChange = useCallback(
    (e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const getFileIcon = (f) => {
    if (!f) return Upload;
    if (f.type === 'application/pdf') return FileText;
    if (f.type?.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const FileIcon = getFileIcon(file);

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
        isDragOver
          ? 'border-emerald-400 bg-emerald-50/50 scale-[1.01]'
          : file
          ? 'border-emerald-300 bg-emerald-50/30'
          : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/50'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && !file && inputRef.current?.click()}
      id={id}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {file ? (
        /* File selected state */
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <FileIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
          </div>
          {onClear && (
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); if (inputRef.current) inputRef.current.value = ''; }}
              className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
              aria-label="Clear file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        /* Drop zone state */
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
            isDragOver ? 'bg-emerald-200' : 'bg-slate-200'
          }`}>
            <Upload className={`h-6 w-6 ${isDragOver ? 'text-emerald-700' : 'text-slate-500'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{label}</p>
            <p className="mt-1 text-xs text-slate-500">
              Drag & drop or{' '}
              <span className="font-semibold text-emerald-600">browse files</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
      )}
    </div>
  );
}
