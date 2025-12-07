import type { Metadata, ReactNode } from "next";
import "@/styles/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://link-checker.itea.dev";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Bookmark Link Checker - Automatically Scan for Broken Links",
		template: `%s | Bookmark Link Checker`,
	},
	description:
		"Free online tool to check for broken, dead, or redirected links in your browser bookmarks. Upload your HTML file and get a detailed report in seconds.",
	alternates: {
		canonical: "/",
		languages: {
			"en-US": "/en",
			"zh-CN": "/zh",
		},
	},
	openGraph: {
		title: "Bookmark Link Checker - Scan for Broken Links",
		description:
			"Easily find and fix broken links in your bookmarks. Our free tool analyzes your bookmark file and provides a clear report.",
		url: siteUrl,
		siteName: "Bookmark Link Checker",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Bookmark Link Checker analyzing links.",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Bookmark Link Checker - Scan for Broken Links",
		description:
			"Clean up your bookmarks! Find all dead and broken links with our fast, free, and secure online checker.",
		images: ["/twitter-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body className="font-body antialiased">{children}</body>
		</html>
	);
}
