import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { BookmarkResult } from '@/types/App';
import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type BookmarkResultsTableProps = {
  results: BookmarkResult[];
  lang: 'zh' | 'en';
};

const translations = {
  zh: {
    resultsTitle: '检查结果',
    resultsDescription: (total: number, ok: number, error: number) =>
      `共检查 ${total} 个书签. <span class="text-green-600 font-medium ml-2">${ok} 个正常</span>, <span class="text-red-600 font-medium ml-2">${error} 个失效</span>.`,
    status: '状态',
    title: '标题',
    url: 'URL',
    errorMessage: '错误信息',
    ok: '正常',
  },
  en: {
    resultsTitle: 'Check Results',
    resultsDescription: (total: number, ok: number, error: number) =>
      `Checked ${total} bookmarks in total. <span class="text-green-600 font-medium ml-2">${ok} OK</span>, <span class="text-red-600 font-medium ml-2">${error} failed</span>.`,
    status: 'Status',
    title: 'Title',
    url: 'URL',
    errorMessage: 'Error Message',
    ok: 'OK',
  },
};

export default function BookmarkResultsTable({ results, lang }: BookmarkResultsTableProps) {
  if (!results || results.length === 0) {
    return null;
  }
  
  const t = translations[lang];
  const errorCount = results.filter(r => r.status === 'error').length;
  const okCount = results.length - errorCount;

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>{t.resultsTitle}</CardTitle>
        <CardDescription
          dangerouslySetInnerHTML={{
            __html: t.resultsDescription(results.length, okCount, errorCount),
          }}
        />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead className="w-[80px]">{t.status}</TableHead>
                <TableHead>{t.title}</TableHead>
                <TableHead>{t.url}</TableHead>
                <TableHead className="w-[250px]">{t.errorMessage}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index} data-status={result.status}>
                  <TableCell>
                    {result.status === 'ok' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-medium">{result.title}</TableCell>
                  <TableCell className="max-w-sm truncate">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                      <span>{result.url}</span>
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    {result.status === 'error' ? (
                       <Badge variant="destructive">{result.errorMessage}</Badge>
                    ) : (
                       <Badge variant="secondary">{t.ok}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

    