import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="bg-muted/50 border-t">
			<div className="container mx-auto py-8 px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-2">
						<a className="flex items-center space-x-2 mb-4" href="/">
							<Image src="/favicon.ico" alt="Logo" width={32} height={32} />
							<span className="font-bold">{t("headerTitle")}</span>
						</a>
						<p className="text-sm text-muted-foreground max-w-xs">{t("description")}</p>
					</div>
					<div>
						<h3 className="font-semibold mb-4">{t("footer.quickLinks.title")}</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://link-checker.itea.dev/"
									className="text-sm text-muted-foreground hover:text-foreground">
									Link Checker
								</a>
							</li>
							<li>
								<a href="https://meta-thief.itea.dev/" className="text-sm text-muted-foreground hover:text-foreground">
									MetaThief
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-4">{t("footer.socials.title")}</h3>
						<ul className="space-y-2">
							{(t("footer.socials.links", { returnObjects: true }) as any[]).map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer"
										className="text-sm text-muted-foreground hover:text-foreground">
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="mt-8 flex items-center justify-between border-t pt-6">
					<p className="text-sm text-muted-foreground">{t("footer.copyright")}</p>
					<p className="text-sm text-muted-foreground">
						Made by{" "}
						<a
							href="http://github.com/isixe"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground hover:underline">
							isixe
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
