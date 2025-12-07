import * as XLSX from "xlsx";
import type { BookmarkResult } from "../types/App";

function downloadFile(blob: Blob, fileName: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const translations = {
  zh: {
    index: "序号",
    title: "标题",
    url: "URL",
    status: "状态",
    errorMessage: "错误信息",
    sheetName: "书签",
  },
  en: {
    index: "Index",
    title: "Title",
    url: "URL",
    status: "Status",
    errorMessage: "Error Message",
    sheetName: "Bookmarks",
  },
};

export function exportToXLSX(
  results: BookmarkResult[],
  fileName: string,
  lang: "zh" | "en",
) {
  const t = translations[lang];
  const dataToExport = results.map((r, index) => ({
    [t.index]: index + 1,
    [t.title]: r.title,
    [t.url]: r.url,
    [t.status]: r.status,
    [t.errorMessage]: r.status === "ok" ? "" : r.errorMessage,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  const columnWidths = [
    { wch: 8 },
    { wch: 40 },
    { wch: 60 },
    { wch: 10 },
    { wch: 30 },
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, t.sheetName);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  downloadFile(data, fileName);
}

export function exportToCsv(
  results: BookmarkResult[],
  fileName: string,
  lang: "zh" | "en",
) {
  const t = translations[lang];
  const dataToExport = results.map((r, index) => ({
    [t.index]: index + 1,
    [t.title]: r.title,
    [t.url]: r.url,
    [t.status]: r.status,
    [t.errorMessage]: r.status === "ok" ? "" : r.errorMessage,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const csvString = XLSX.utils.sheet_to_csv(worksheet);
  const data = new Blob([`\uFEFF${csvString}`], {
    type: "text/csv;charset=utf-8;",
  });

  downloadFile(data, fileName);
}

export function exportToTxt(results: BookmarkResult[], fileName: string) {
  const urls = results.map((r) => r.url).join("\n");
  const data = new Blob([urls], { type: "text/plain;charset=utf-8" });

  downloadFile(data, fileName);
}

export function exportToJson(results: BookmarkResult[], fileName: string) {
  const jsonString = JSON.stringify(results, null, 2);
  const data = new Blob([jsonString], {
    type: "application/json;charset=utf-8",
  });

  downloadFile(data, fileName);
}

export function exportToHtml(results: BookmarkResult[], fileName: string) {
  let html = "<!DOCTYPE html>\n";
  html +=
    '<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Bookmarks</title>\n</head>\n<body>\n';
  html += "<h1>Bookmarks</h1>\n<dl><p>\n";
  results.forEach((bookmark) => {
    html += `    <dt><a href="${bookmark.url}">${bookmark.title}</a></dt>\n`;
  });
  html += "</p></dl>\n</body>\n</html>";

  const data = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadFile(data, fileName);
}
