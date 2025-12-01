'use server';

import type { Bookmark, BookmarkResult } from '@/types/App';

async function checkSingleLink(bookmark: Bookmark): Promise<BookmarkResult> {
  try {
    if (!bookmark.url.startsWith('http')) {
      return {
        ...bookmark,
        status: 'error',
        errorMessage: 'Invalid URL protocol',
      };
    }

    const response = await fetch(bookmark.url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      redirect: 'follow',
    });

    if (response.ok) {
      return {
        ...bookmark,
        status: 'ok',
      };
    } else {
      return {
        ...bookmark,
        status: 'error',
        errorMessage: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: any) {
    let errorMessage = 'Request failed';
    if (error.name === 'TimeoutError') {
      errorMessage = 'Request timed out';
    } else if (error instanceof TypeError && error.message.includes('fetch failed')) {
      errorMessage = 'Network error or invalid domain';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      ...bookmark,
      status: 'error',
      errorMessage,
    };
  }
}

export async function checkLinks(bookmarks: Bookmark[]): Promise<BookmarkResult[]> {
  const promises = bookmarks.map(checkSingleLink);
  const results = await Promise.all(promises);
  return results;
}
