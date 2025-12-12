"use client";

import { useState, type ElementType } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { BookmarkResult } from "@/types/App";
import { FileSpreadsheet, FileText, RotateCcw, FileJson, FileCode, FileType, FileTerminal } from "lucide-react";
import { exportToXLSX, exportToTxt, exportToJson, exportToHtml, exportToCsv } from "@/lib/xlsx";
import { useTranslation } from "react-i18next";

type BookmarkExportProps = {
	results: BookmarkResult[];
	onReset: () => void;
};

type ExportFilter = "all" | "ok" | "error";
type ExportFormat = "xlsx" | "txt" | "json" | "html" | "csv";

const formatOptions: {
	value: ExportFormat;
	label: string;
	icon: ElementType;
}[] = [
	{ value: "xlsx", label: "Excel (XLSX)", icon: FileSpreadsheet },
	{ value: "csv", label: "CSV", icon: FileTerminal },
	{ value: "json", label: "JSON", icon: FileJson },
	{ value: "html", label: "HTML", icon: FileCode },
	{ value: "txt", label: "URL List (TXT)", icon: FileText },
];

export default function BookmarkExport({ results, onReset }: BookmarkExportProps) {
	const { t } = useTranslation();
	const [filter, setFilter] = useState<ExportFilter>("all");
	const [exportFormat, setExportFormat] = useState<ExportFormat>("xlsx");

	const handleExport = () => {
		let filteredResults = results;
		if (filter === "ok") {
			filteredResults = results.filter((r) => r.status === "ok");
		} else if (filter === "error") {
			filteredResults = results.filter((r) => r.status === "error");
		}

		const baseFileName = t("export.baseFileName");

		switch (exportFormat) {
			case "xlsx":
				exportToXLSX(filteredResults, `${baseFileName}.xlsx`);
				break;
			case "txt":
				exportToTxt(filteredResults, `${baseFileName}_urls.txt`);
				break;
			case "json":
				exportToJson(filteredResults, `${baseFileName}.json`);
				break;
			case "html":
				exportToHtml(filteredResults, `${baseFileName}.html`);
				break;
			case "csv":
				exportToCsv(filteredResults, `${baseFileName}.csv`);
				break;
		}
	};

	const ExportIcon = formatOptions.find((f) => f.value === exportFormat)?.icon || FileType;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("export.exportOptions")}</CardTitle>
				<CardDescription>{t("export.exportDescription")}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<Label className="font-semibold">{t("export.linksToExport")}</Label>
					<RadioGroup
						value={filter}
						onValueChange={(v) => setFilter(v as ExportFilter)}
						className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<RadioGroupItem value="all" id="all" className="peer sr-only" />
							<Label
								htmlFor="all"
								className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
								{t("export.allLinks")}
							</Label>
						</div>
						<div>
							<RadioGroupItem value="ok" id="ok" className="peer sr-only" />
							<Label
								htmlFor="ok"
								className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
								{t("export.okLinks")}
							</Label>
						</div>
						<div>
							<RadioGroupItem value="error" id="error" className="peer sr-only" />
							<Label
								htmlFor="error"
								className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
								{t("export.errorLinks")}
							</Label>
						</div>
					</RadioGroup>
				</div>

				<div>
					<Label className="font-semibold">{t("export.exportFormat")}</Label>
					<RadioGroup
						value={exportFormat}
						onValueChange={(v) => setExportFormat(v as ExportFormat)}
						className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
						{formatOptions.map((option) => (
							<div key={option.value}>
								<RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
								<Label
									htmlFor={option.value}
									className="flex flex-row items-center justify-center cursor-pointer rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-sm gap-2">
									<option.icon className="h-5 w-5" />
									{option.label}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>

				<div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-border">
					<Button onClick={onReset} variant="outline" className="w-full sm:w-auto">
						<RotateCcw className="mr-2" />
						{t("export.checkAnotherFile")}
					</Button>
					<Button
						onClick={handleExport}
						className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
						<ExportIcon className="mr-2" />
						{t("export.exportBookmarks")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
