import React, { useState, useRef } from 'react';

interface FilePickerProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  showFileList?: boolean;
  dragAndDrop?: boolean;
  variant?: 'button' | 'dropzone';
  onChange?: (files: FileList | null) => void;
  onError?: (error: string) => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const FilePicker: React.FC<FilePickerProps> = ({
  label,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  showFileList = true,
  dragAndDrop = true,
  variant = 'dropzone',
  onChange,
  onError,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): boolean => {
    setLocalError('');

    if (maxFiles && files.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} file(s) allowed`;
      setLocalError(errorMsg);
      if (onError) onError(errorMsg);
      return false;
    }

    if (maxSize) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
          const errorMsg = `File ${files[i].name} exceeds maximum size of ${formatFileSize(maxSize)}`;
          setLocalError(errorMsg);
          if (onError) onError(errorMsg);
          return false;
        }
      }
    }

    return true;
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!validateFiles(files)) return;

    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    if (onChange) onChange(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && dragAndDrop) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || !dragAndDrop) return;

    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="my-4 max-w-md">
      {label && (
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
        required={required}
        className="hidden"
      />
      {variant === 'dropzone' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`
            border-2 border-dashed rounded-2xl p-8
            ${isDragging ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : error || localError ? 'border-red-400' : 'border-zinc-300 dark:border-zinc-600'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-zinc-800/50'}
            transition-all duration-200
            flex flex-col items-center justify-center gap-3
          `.trim().replace(/\s+/g, ' ')}
        >
          <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-300 font-medium">
              {dragAndDrop ? 'Drop files here or click to browse' : 'Click to browse files'}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {accept && `Accepted: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {maxFiles && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={`
            px-4 py-2.5 rounded-xl border
            ${error || localError ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'}
            text-zinc-900 dark:text-white font-medium
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-orange-500'}
            transition-all duration-200
            flex items-center gap-2
          `.trim().replace(/\s+/g, ' ')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Choose File{multiple ? 's' : ''}
        </button>
      )}
      {showFileList && selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-zinc-400">
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-zinc-400 hover:text-red-400 transition-colors ml-2"
                aria-label="Remove file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {(helperText || (error && errorMessage) || localError) && (
        <p className={`mt-2 text-xs ${error || localError ? 'text-red-400' : 'text-zinc-400'}`}>
          {localError || (error && errorMessage ? errorMessage : helperText)}
        </p>
      )}
    </div>
  );
};

export default FilePicker;

export const metadata = {
  name: 'file-picker',
  category: 'inputs' as const,
  component: FilePicker,
  description: 'File upload component with drag-and-drop support, file validation, size limits, and preview. Supports single or multiple files.',
  tags: ['ui', 'input', 'form', 'file', 'upload', 'drag-drop'],
};
