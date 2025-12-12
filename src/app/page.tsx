"use client";

import "@/locale";

import { useCallback, useMemo, useState } from "react";
import { Bookmark, BookmarkResult } from "@/types/App";
import BookmarkUploader from "@/components/widget/bookmark-uploader";
import BookmarkResultsTable from "@/components/bookmark/bookmark-results-table";
import BookmarkExport from "@/components/bookmark/bookmark-export";
import { checkLinks } from "@/app/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { Link as LinkIcon, FileCheck2, ShieldCheck, Download, Zap, GaugeCircle, type LucideIcon } from "lucide-react";

// ============================================================================
// Types & Constants
// ============================================================================

interface Feature {
	icon: string;
	title: string;
	description: string;
}

interface Step {
	title: string;
	description: string;
}

interface MultiLangContent {
	features: Feature[];
	steps: Step[];
}

const ICON_MAP: Record<string, LucideIcon> = {
	Link: LinkIcon,
	FileCheck2,
	ShieldCheck,
	Download,
	Zap,
	GaugeCircle,
};

const ICON_SIZE = "h-5 w-5";
const ICON_CONTAINER_SIZE = "h-10 w-10";
const STEP_NUMBER_SIZE = "w-16 h-16";

// ============================================================================
// Main Component
// ============================================================================

export default function Home() {
	const { t } = useTranslation();

	// State management
	const [results, setResults] = useState<BookmarkResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isDone, setIsDone] = useState(false);

	// Fetch and process bookmarks
	const handleBookmarksParsed = useCallback(async (parsedBookmarks: Bookmark[]) => {
		if (parsedBookmarks.length === 0) return;

		setIsLoading(true);
		setIsDone(false);
		setResults([]);

		try {
			const checkedResults = await checkLinks(parsedBookmarks);
			setResults(checkedResults);
		} catch (error) {
			console.error("Error checking links:", error);
		} finally {
			setIsLoading(false);
			setIsDone(true);
		}
	}, []);

	// Reset to initial state
	const resetState = useCallback(() => {
		setResults([]);
		setIsLoading(false);
		setIsDone(false);
	}, []);

	// Type-safe i18n data
	const multiLangContent = useMemo(() => {
		return {
			features: (t("features", { returnObjects: true }) || []) as Feature[],
			steps: (t("steps", { returnObjects: true }) || []) as Step[],
		} as MultiLangContent;
	}, [t]);

	// Render results section when done
	const renderResults = () => (
		<div className="w-full max-w-4xl space-y-4 px-4 mb-8 mt-4">
			<BookmarkExport results={results} onReset={resetState} />
			<BookmarkResultsTable results={results} />
		</div>
	);

	// Render feature cards
	const renderFeatures = () => (
		<section id="features" className="w-full bg-muted/50 py-6 sm:py-8">
			<div className="container mx-auto max-w-6xl px-4">
				<div className="text-center space-y-2 mb-8">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("featuresTitle")}</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("featuresDescription")}</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{multiLangContent.features.map((feature, index) => (
						<FeatureCard key={`feature-${index}`} feature={feature} />
					))}
				</div>
			</div>
		</section>
	);

	// Render how-it-works steps
	const renderSteps = () => (
		<section id="how-it-works" className="w-full py-6 sm:py-8">
			<div className="container mx-auto max-w-4xl px-4 space-y-8">
				<div className="text-center space-y-2">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("howItWorksTitle")}</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
					{multiLangContent.steps.map((step, index) => (
						<StepCard key={`step-${index}`} step={step} index={index} />
					))}
				</div>
			</div>
		</section>
	);

	// Main upload section
	const renderUploader = () => (
		<section className="w-full py-6 sm:py-8">
			<div className="container mx-auto max-w-4xl px-4 space-y-4 text-center">
				<h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t("title")}</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t("description")}</p>
				<div className="pt-4">
					<BookmarkUploader
						onBookmarksParsed={handleBookmarksParsed}
						isLoading={isLoading}
						loadingMessage={t("uploader.loading")}
						patienceMessage={t("uploader.patience")}
					/>
				</div>
			</div>
		</section>
	);

	const renderContent = () => {
		if (isDone) {
			return renderResults();
		}

		return (
			<>
				{renderUploader()}
				{renderFeatures()}
				{renderSteps()}
			</>
		);
	};

	return (
		<div className="relative flex min-h-screen flex-col">
			<Header />
			<main className="flex flex-1 w-full flex-col items-center bg-background">{renderContent()}</main>
			<Footer />
		</div>
	);
}

// ============================================================================
// Sub-Components
// ============================================================================

interface FeatureCardProps {
	feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
	const IconComponent = ICON_MAP[feature.icon];

	return (
		<Card className="bg-card shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50">
			<CardHeader className="flex flex-row items-center gap-4">
				<div className={`flex ${ICON_CONTAINER_SIZE} items-center justify-center rounded-lg bg-primary/10`}>
					{IconComponent ? (
						<IconComponent className={`${ICON_SIZE} text-primary`} />
					) : (
						<span className="text-xs text-muted-foreground">N/A</span>
					)}
				</div>
				<CardTitle className="text-lg">{feature.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm">{feature.description}</p>
			</CardContent>
		</Card>
	);
}

interface StepCardProps {
	step: Step;
	index: number;
}

function StepCard({ step, index }: StepCardProps) {
	return (
		<div className="flex flex-col items-center space-y-3 p-4">
			<div
				className={`flex ${STEP_NUMBER_SIZE} items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl`}>
				{index + 1}
			</div>
			<h3 className="text-lg font-semibold">{step.title}</h3>
			<p className="text-muted-foreground text-sm">{step.description}</p>
		</div>
	);
}
