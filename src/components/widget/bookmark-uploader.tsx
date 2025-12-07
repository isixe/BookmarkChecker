"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import type { Bookmark } from "@/types/App";
import { useTranslation } from "react-i18next";

type BookmarkUploaderProps = {
	onBookmarksParsed: (_bookmarks: Bookmark[]) => void;
	isLoading: boolean;
	loadingMessage: string;
	patienceMessage: string;
};

export default function BookmarkUploader({
	onBookmarksParsed,
	isLoading,
	loadingMessage,
	patienceMessage,
}: BookmarkUploaderProps) {
	const { t } = useTranslation();
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const parseHtmlFile = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			if (!text) {
				console.error(t("uploader.errorReadingFileDesc"));
				return;
			}
			const parser = new DOMParser();
			const doc = parser.parseFromString(text, "text/html");
			const links = Array.from(doc.querySelectorAll("a"));

			const bookmarks: Bookmark[] = links
				.map((link) => ({
					title: link.textContent?.trim() || "No Title",
					url: link.href,
				}))
				.filter((b) => b.url && (b.url.startsWith("http://") || b.url.startsWith("https://")));

			onBookmarksParsed(bookmarks);
		};
		reader.onerror = () => {
			console.error(t("uploader.couldNotReadFile"));
		};
		reader.readAsText(file);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isLoading) return;
		const file = e.target.files?.[0];
		if (file) {
			if (file.type !== "text/html") {
				console.error(t("uploader.invalidFileTypeDesc"));
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
			if (file.type !== "text/html") {
				console.error(t("uploader.invalidFileTypeDesc"));
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
	};

	return (
		<div
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onClick={handleClick}
			className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
				isLoading
					? "border-border bg-card cursor-not-allowed"
					: isDragging
						? "border-primary bg-primary/10 cursor-pointer"
						: "border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
			}`}>
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
					<p className="text-lg font-semibold text-foreground">{loadingMessage}</p>
					<p className="text-muted-foreground">{patienceMessage}</p>
				</>
			) : (
				<>
					<FileUp className="h-12 w-12 text-muted-foreground" />
					<p className="text-lg font-semibold text-foreground">{t("uploader.dragAndDrop")}</p>
					<p className="text-sm text-muted-foreground">{t("uploader.fileHint")}</p>
				</>
			)}
		</div>
	);
}
