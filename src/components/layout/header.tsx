import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, Languages, Github } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  return (
    <header className="w-full flex bg-background justify-center">
      <div className="container flex h-14 items-center justify-center">
        <a className="flex items-center space-x-2" href="/">
          <Link className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            {t("headerTitle")}
          </span>
        </a>
        <div className="flex items-center space-x-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent focus-visible:ring-0"
              >
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-none">
              <DropdownMenuItem onSelect={() => i18n.changeLanguage("zh")}>
                简体中文
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => i18n.changeLanguage("en")}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/isixe/BookmarkChecker"
          >
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent focus-visible:ring-0"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
