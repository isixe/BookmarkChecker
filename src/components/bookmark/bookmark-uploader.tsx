'use client';

import { useRef, useState, type DragEvent } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import type { Bookmark } from '@/types/App';

type BookmarkUploaderProps = {
  onBookmarksParsed: (bookmarks: Bookmark[]) => void;
  lang: 'zh' | 'en';
  isLoading: boolean;
  loadingMessage: string;
  patienceMessage: string;
};

const translations = {
  zh: {
    uploadTitle: '上传您的书签文件',
    dragAndDrop: '将您的书签文件拖放到此处，或点击选择',
    fileHint: '（通常从您的浏览器中导出为 HTML 文件）',
    invalidFileType: '文件类型无效',
    invalidFileTypeDesc: '请上传 HTML 书签文件。',
    errorReadingFile: '读取文件出错',
    errorReadingFileDesc: '文件似乎是空的。',
    couldNotReadFile: '无法读取所选文件。'
  },
  en: {
    uploadTitle: 'Upload Your Bookmarks',
    dragAndDrop: 'Drag & drop your bookmark file here, or click to select',
    fileHint: '(Usually exported from your browser as an HTML file)',
    invalidFileType: 'Invalid File Type',
    invalidFileTypeDesc: 'Please upload an HTML bookmark file.',
    errorReadingFile: 'Error reading file',
    errorReadingFileDesc: 'File appears to be empty.',
    couldNotReadFile: 'Could not read the selected file.'
  }
};

export default function BookmarkUploader({ onBookmarksParsed, lang, isLoading, loadingMessage, patienceMessage }: BookmarkUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const parseHtmlFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        console.error(t.errorReadingFileDesc);
        return;
      }
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      
      const bookmarks: Bookmark[] = links
        .map(link => ({
          title: link.textContent?.trim() || 'No Title',
          url: link.href,
        }))
        .filter(b => b.url && (b.url.startsWith('http://') || b.url.startsWith('https://')));

      onBookmarksParsed(bookmarks);
    };
    reader.onerror = () => {
      console.error(t.couldNotReadFile);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/html') {
        console.error(t.invalidFileTypeDesc);
        return;
      }
      parseHtmlFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isLoading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'text/html') {
        console.error(t.invalidFileTypeDesc);
        return;
      }
      parseHtmlFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  }

  return (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
            isLoading
              ? 'border-border bg-card cursor-not-allowed'
              : isDragging 
                ? 'border-primary bg-primary/10 cursor-pointer' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".html"
            className="hidden"
            disabled={isLoading}
          />
          {isLoading ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-semibold text-foreground">
                {loadingMessage}
              </p>
              <p className="text-muted-foreground">{patienceMessage}</p>
            </>
          ) : (
            <>
              <FileUp className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">
                {t.dragAndDrop}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.fileHint}
              </p>
            </>
          )}
        </div>
  );
}

    