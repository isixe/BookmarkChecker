export type Bookmark = {
  title: string;
  url: string;
};

export type BookmarkStatus = "ok" | "error";

export type BookmarkResult = Bookmark & {
  status: BookmarkStatus;
  errorMessage?: string;
};
