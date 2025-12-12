"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BookmarkResult } from "@/types/App";
import { ExternalLink, CheckCircle2, XCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type BookmarkResultsTableProps = {
	results: BookmarkResult[];
};

type FilterType = "all" | "ok" | "error";

export default function BookmarkResultsTable({ results }: BookmarkResultsTableProps) {
	const { t } = useTranslation(); // Moved useTranslation to the top level
	const [filter, setFilter] = useState<FilterType>("all");

	if (!results || results.length === 0) {
		return null;
	}

	const errorCount = results.filter((r) => r.status === "error").length;
	const okCount = results.length - errorCount;

	const filteredResults = results.filter((result) => {
		if (filter === "all") return true;
		if (filter === "ok") return result.status === "ok";
		if (filter === "error") return result.status === "error";
		return true;
	});

	return (
		<Card className="mb-5">
			<CardHeader>
				<CardTitle>{t("results.resultsTitle")}</CardTitle>
				<CardDescription>
					{t("results.totalChecked", { count: results.length })}{" "}
					<span className="text-green-600 font-medium ml-2">
						{okCount} {t("results.successCount")}
					</span>
					,
					<span className="text-red-600 font-medium ml-2">
						{errorCount} {t("results.failedCount")}
					</span>
					.
				</CardDescription>

				<div className="flex items-center gap-2 pt-4">
					<Filter className="h-4 w-4 text-muted-foreground" />
					<div className="flex gap-2">
						<Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
							{t("results.all")} ({results.length})
						</Button>
						<Button
							variant={filter === "ok" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilter("ok")}
							className={filter === "ok" ? "" : "text-green-600 hover:text-green-700"}>
							<CheckCircle2 className="h-4 w-4 mr-1" />
							{t("results.success")} ({okCount})
						</Button>
						<Button
							variant={filter === "error" ? "default" : "outline"}
							size="sm"
							onClick={() => setFilter("error")}
							className={filter === "error" ? "" : "text-red-600 hover:text-red-700"}>
							<XCircle className="h-4 w-4 mr-1" />
							{t("results.failed")} ({errorCount})
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="w-full overflow-x-auto rounded-md border">
					<Table className="min-w-full">
						<TableHeader className="sticky top-0 bg-muted z-10">
							<TableRow>
								<TableHead className="w-[100px] min-w-[100px]">{t("results.status")}</TableHead>
								<TableHead className="w-[200px] min-w-[200px]">{t("results.title")}</TableHead>
								<TableHead className="w-[300px] min-w-[300px]">{t("results.url")}</TableHead>
								<TableHead className="w-[250px] min-w-[250px]">{t("results.errorMessage")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredResults.map((result, index) => (
								<TableRow key={index} data-status={result.status} className="h-auto">
									<TableCell className="w-[100px] min-w-[100px] py-3">
										{result.status === "ok" ? (
											<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
										) : (
											<XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
										)}
									</TableCell>
									<TableCell className="w-[200px] min-w-[200px] py-3 break-words font-medium">{result.title}</TableCell>
									<TableCell className="w-[300px] min-w-[300px] py-3">
										<a
											href={result.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-start gap-2 text-primary hover:underline break-all">
											<span className="flex-1">{result.url}</span>
											<ExternalLink className="h-4 w-4 flex-shrink-0 mt-1" />
										</a>
									</TableCell>
									<TableCell className="w-[250px] min-w-[250px] py-3">
										{result.status === "error" ? (
											<Badge variant="destructive" className="break-words whitespace-normal">
												{result.errorMessage}
											</Badge>
										) : (
											<Badge variant="secondary">{t("results.ok")}</Badge>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
