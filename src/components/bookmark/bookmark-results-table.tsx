import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { BookmarkResult } from "@/types/App";
import { ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type BookmarkResultsTableProps = {
	results: BookmarkResult[];
	lang: "zh" | "en";
};

export default function BookmarkResultsTable({ results, lang }: BookmarkResultsTableProps) {
	if (!results || results.length === 0) {
		return null;
	}

	const { t } = useTranslation();
	const errorCount = results.filter((r) => r.status === "error").length;
	const okCount = results.length - errorCount;

	return (
		<Card className="mb-5">
			<CardHeader>
				<CardTitle>{t("results.resultsTitle")}</CardTitle>
				<CardDescription>
					{lang === "zh" ? (
						<>
							共检查 {results.length} 个书签. <span className="text-green-600 font-medium ml-2">{okCount} 个正常</span>,
							<span className="text-red-600 font-medium ml-2">{errorCount} 个失效</span>.
						</>
					) : (
						<>
							Checked {results.length} bookmarks in total.{" "}
							<span className="text-green-600 font-medium ml-2">{okCount} OK</span>,
							<span className="text-red-600 font-medium ml-2">{errorCount} failed</span>.
						</>
					)}
				</CardDescription>
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
							{results.map((result, index) => (
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
