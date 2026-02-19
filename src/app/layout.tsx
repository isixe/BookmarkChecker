import "@/styles/globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
	const headersList = await headers();
	const protocol = headersList.get("x-forwarded-proto") || "http";
	const host = headersList.get("host") || "localhost:3000";
	const url = `${protocol}://${host}`;

	return {
		title: {
			default: "Bookmark Link Checker - Automatically Scan for Broken Links",
			template: `%s | Bookmark Link Checker`,
		},
		keywords: "bookmark scan, bookmark link checker, link checker, bookmark tool",
		description:
			"Free online tool to check for broken, dead, or redirected links in your browser bookmarks. Upload your HTML file and get a detailed report in seconds.",
		alternates: {
			canonical: "/",
		},
		openGraph: {
			title: "Bookmark Link Checker - Scan for Broken Links",
			description:
				"Easily find and fix broken links in your bookmarks. Our free tool analyzes your bookmark file and provides a clear report.",
			url,
			siteName: "Bookmark Link Checker",
			images: [
				{
					url: `${url}/og-image.png`,
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
			images: [`${url}/og-image.png`],
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const analyticsScript = process.env.ANALYTICS_SCRIPT ?? "";
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				{analyticsScript && <Script src={analyticsScript} id="analytics" data-website-id="bookmark-checker" defer />}
			</head>
			<body className="font-body antialiased">{children}</body>
		</html>
	);
}
