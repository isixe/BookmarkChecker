"use client";

import { useState } from "react";
import { Bookmark, BookmarkResult } from "@/types/App";
import BookmarkUploader from "@/components/bookmark/bookmark-uploader";
import BookmarkResultsTable from "@/components/bookmark/bookmark-results-table";
import BookmarkExport from "@/components/bookmark/bookmark-export";
import { checkLinks } from "@/app/api";
import { Link, FileCheck2, ShieldCheck, Download, Zap, GaugeCircle, Languages, Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const translations = {
	zh: {
		title: "您的书签验证器",
		description: "告别失效链接烦恼。上传您的书签文件，我们将自动为您检测所有链接的有效性，并生成清晰的报告。",
		featuresTitle: "为何选择我们？",
		featuresDescription: "我们提供强大、易用且安全的服务，帮助您轻松管理日益增长的书签收藏。",
		features: [
			{
				icon: Link,
				title: "全面链接检测",
				description: "自动检测失效、超时或重定向的链接，确保您的书签库始终有效。",
			},
			{
				icon: FileCheck2,
				title: "批量上传处理",
				description: "支持标准浏览器导出的HTML书签文件，一次性处理数千个链接。",
			},
			{
				icon: ShieldCheck,
				title: "安全隐私保障",
				description: "所有处理均在您的设备和我们的服务器上安全进行，我们绝不存储您的书签数据。",
			},
			{
				icon: Download,
				title: "多种导出选项",
				description: "可将扫描结果导出为 XLSX 或 TXT 文件，方便您进行备份、清理或迁移。",
			},
			{
				icon: Zap,
				title: "极速并发检查",
				description: "采用优化的并发检查技术，在最短的时间内快速完成检测任务。",
			},
			{
				icon: GaugeCircle,
				title: "详细状态报告",
				description: "提供包含 HTTP 状态码和错误信息的详细报告，让问题链接一目了然。",
			},
		],
		howItWorksTitle: "简单三步，焕新您的书签",
		steps: [
			{ title: "上传文件", description: "从您的浏览器导出书签为 HTML 文件并上传。" },
			{ title: "自动扫描", description: "我们的系统将快速检测所有链接的有效性。" },
			{ title: "下载报告", description: "查看详细结果，并将干净的书签列表导出。" },
		],
		headerTitle: "书签检查器",
		footer: {
			copyright: `© ${new Date().getFullYear()} 书签检查器. 版权所有.`,
			quickLinks: {
				title: "快速链接",
			},
			socials: {
				title: "社交媒体",
				links: [
					{ name: "纸船实验室", href: "https://itea.dev/" },
					{ name: "漂流", href: "https://drifter.itea.dev/" },
					{ name: "赞助", href: "https://github.com/sponsors/Libroka" },
				],
			},
		},
		uploader: {
			loading: "正在检查链接...",
			patience: "书签越多，时间越长，请耐心等待。",
		},
	},
	en: {
		title: "Your Bookmark Validator",
		description:
			"Say goodbye to broken links. Upload your bookmark file, and we will automatically check the validity of all links and generate a clear report.",
		featuresTitle: "Why Choose Us?",
		featuresDescription:
			"We provide a powerful, easy-to-use, and secure service to help you effortlessly manage your growing bookmark collection.",
		features: [
			{
				icon: Link,
				title: "Comprehensive Link Check",
				description:
					"Automatically detect broken, timed-out, or redirected links to ensure your bookmark library is always valid.",
			},
			{
				icon: FileCheck2,
				title: "Batch Upload Processing",
				description:
					"Supports standard HTML bookmark files exported from browsers, processing thousands of links at once.",
			},
			{
				icon: ShieldCheck,
				title: "Security & Privacy",
				description:
					"All processing is done securely on your device and our servers. We never store your bookmark data.",
			},
			{
				icon: Download,
				title: "Multiple Export Options",
				description: "Export scan results as XLSX or TXT files for easy backup, cleaning, or migration.",
			},
			{
				icon: Zap,
				title: "High-Speed Concurrent Checking",
				description:
					"Uses optimized concurrent checking technology to complete detection tasks in the shortest possible time.",
			},
			{
				icon: GaugeCircle,
				title: "Detailed Status Reports",
				description:
					"Provides detailed reports with HTTP status codes and error messages, making problematic links clear at a glance.",
			},
		],
		howItWorksTitle: "Refresh Your Bookmarks in Three Simple Steps",
		steps: [
			{ title: "Upload File", description: "Export your bookmarks from your browser as an HTML file and upload it." },
			{ title: "Automatic Scan", description: "Our system will quickly check the validity of all your links." },
			{ title: "Download Report", description: "View the detailed results and export a clean list of your bookmarks." },
		],
		headerTitle: "Bookmark Checker",
		footer: {
			copyright: `© ${new Date().getFullYear()} Bookmark Checker. All rights reserved.`,
			quickLinks: {
				title: "Quick Links",
			},
			socials: {
				title: "Socials",
				links: [
					{ name: "Lab", href: "https://itea.dev/" },
					{ name: "Drifter", href: "https://drifter.itea.dev/" },
					{ name: "Sponsor", href: "https://github.com/sponsors/Libroka" },
				],
			},
		},
		uploader: {
			loading: "Checking links...",
			patience: "The more bookmarks, the longer it takes. Please be patient.",
		},
	},
};

export default function Home() {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [results, setResults] = useState<BookmarkResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isDone, setIsDone] = useState(false);
	const [lang, setLang] = useState<"zh" | "en">("en");

	const t = translations[lang];

	const handleBookmarksParsed = async (parsedBookmarks: Bookmark[]) => {
		if (parsedBookmarks.length === 0) {
			return;
		}

		setBookmarks(parsedBookmarks);
		setIsLoading(true);
		setIsDone(false);
		setResults([]);

		try {
			const checkedResults = await checkLinks(parsedBookmarks);
			setResults(checkedResults);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
			setIsDone(true);
		}
	};

	const resetState = () => {
		setBookmarks([]);
		setResults([]);
		setIsLoading(false);
		setIsDone(false);
	};

	const renderContent = () => {
		if (isDone) {
			return (
				<div className="w-full max-w-4xl space-y-4 px-4">
					<BookmarkExport results={results} onReset={resetState} lang={lang} />
					<BookmarkResultsTable results={results} lang={lang} />
				</div>
			);
		}

		return (
			<>
				<section className="w-full py-6 sm:py-8">
					<div className="container mx-auto max-w-4xl px-4 space-y-4 text-center">
						<h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t.title}</h1>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t.description}</p>
						<div className="pt-4">
							<BookmarkUploader
								onBookmarksParsed={handleBookmarksParsed}
								lang={lang}
								isLoading={isLoading}
								loadingMessage={t.uploader.loading}
								patienceMessage={t.uploader.patience}
							/>
						</div>
					</div>
				</section>

				<section id="features" className="w-full bg-muted/50 py-6 sm:py-8">
					<div className="container mx-auto max-w-6xl px-4">
						<div className="text-center space-y-2 mb-8">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.featuresTitle}</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t.featuresDescription}</p>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{t.features.map((feature, index) => (
								<Card
									key={index}
									className="bg-card shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
									<CardHeader className="flex flex-row items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
											<feature.icon className="h-5 w-5 text-primary" />
										</div>
										<CardTitle className="text-lg">{feature.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground text-sm">{feature.description}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				<section id="how-it-works" className="w-full py-6 sm:py-8">
					<div className="container mx-auto max-w-4xl px-4 space-y-8">
						<div className="text-center space-y-2">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.howItWorksTitle}</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
							{t.steps.map((step, index) => (
								<div key={index} className="flex flex-col items-center space-y-3 p-4">
									<div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl">
										{index + 1}
									</div>
									<h3 className="text-lg font-semibold">{step.title}</h3>
									<p className="text-muted-foreground text-sm">{step.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</>
		);
	};

	return (
		<div className="relative flex min-h-screen flex-col">
			<header className="w-full flex bg-background justify-center">
				<div className="container flex h-14 items-center justify-center">
					<a className="flex items-center space-x-2" href="/">
						<Link className="h-6 w-6 text-primary" />
						<span className="hidden font-bold sm:inline-block">{t.headerTitle}</span>
					</a>
					<div className="flex items-center space-x-2 ml-auto">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="hover:bg-transparent focus-visible:ring-0">
									<Languages className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onSelect={() => setLang("zh")}>简体中文</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => setLang("en")}>English</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<a target="_blank" rel="noreferrer" href="https://github.com/firebase/studio-content">
							<Button variant="ghost" size="icon" className="hover:bg-transparent focus-visible:ring-0">
								<Github className="h-5 w-5" />
								<span className="sr-only">GitHub</span>
							</Button>
						</a>
					</div>
				</div>
			</header>

			<main className="flex flex-1 w-full flex-col items-center bg-background">{renderContent()}</main>

			<footer className="bg-muted/50 border-t">
				<div className="container mx-auto py-8 px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="col-span-1 md:col-span-2">
							<a className="flex items-center space-x-2 mb-4" href="/">
								<Link className="h-6 w-6 text-primary" />
								<span className="font-bold">{t.headerTitle}</span>
							</a>
							<p className="text-sm text-muted-foreground max-w-xs">{t.description}</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">{t.footer.quickLinks.title}</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="https://link-checker.itea.dev/"
										className="text-sm text-muted-foreground hover:text-foreground">
										Link Checker
									</a>
								</li>
								<li>
									<a
										href="https://meta-thief.itea.dev/"
										className="text-sm text-muted-foreground hover:text-foreground">
										MetaThief
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">{t.footer.socials.title}</h3>
							<ul className="space-y-2">
								{t.footer.socials.links.map((link) => (
									<li key={link.name}>
										<a
											href={link.href}
											target="_blank"
											rel="noreferrer"
											className="text-sm text-muted-foreground hover:text-foreground">
											{link.name}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="mt-8 flex items-center justify-between border-t pt-6">
						<p className="text-sm text-muted-foreground">{t.footer.copyright}</p>
						<p className="text-sm text-muted-foreground">
							Made by{" "}
							<a
								href="http://github.com/isixe"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-foreground hover:underline">
								isixe
							</a>
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
