# BookmarkChecker

<p align="center">
<img src="https://github.com/isixe/BookmarkChecker/blob/main/public/favicon.png?raw=true" alt="BookmarkChecker Logo" width="100" />
</p>

<p align="center">
  A bookmark link checker tool.
</p>

<div align="center">

Upload your bookmark file, automatically check all links for validity, and generate clear reports.

</div>

## Features

- **Comprehensive Link Checking** - Automatically detect broken, timeout, or redirected links
- **Batch Upload Processing** - Support standard browser-exported HTML bookmark files
- **Secure & Private** - All processing is done securely on your device and our servers, we never store your bookmark data
- **Multiple Export Options** - Export results to XLSX, TXT, CSV, JSON, HTML, and more
- **Fast Concurrent Checking** - Optimized concurrent checking technology for rapid detection
- **Detailed Status Reports** - Provide detailed reports with HTTP status codes and error messages

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Component Library**: [Shadcn-ui](https://shadcn-ui.com/)
- **Icon**: [Lucide Icons](https://lucide.dev/)


## Usage

1. **Upload File** - Export bookmarks from your browser as an HTML file and upload
2. **Auto Scan** - The system will quickly check all links for validity
3. **View Results** - Check the detailed results
4. **Export Report** - Export the clean bookmark list in your desired format


## Quick Start

1. Clone the Repository

```bash
git clone https://github.com/isixe/BookmarkChecker.git
cd BookmarkChecker
```

2. Install Dependencies

```bash
pnpm install
```

3. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000` in your browser.


## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── bookmark/         # Bookmark components
│   ├── layout/           # Layout components
│   ├── ui/               # UI base components
│   └── widget/           # Feature widgets
├── lib/                   # Utilities
├── locale/                # i18n resources
├── styles/                # Global styles
└── types/                 # TypeScript type definitions
```

## License

This project is licensed under the [MIT](LICENSE) license.
