"use client";

import { useEffect, useRef } from "react";

export default function Adsense() {
	const pushed = useRef(false);

	useEffect(() => {
		if (pushed.current) return;
		pushed.current = true;
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error("Adsense push error:", err);
		}
	}, []);

	return (
		<>
			<div className="mt-12 w-full">
				<ins
					className="adsbygoogle block"
					data-ad-client="ca-pub-1891811866184778"
					data-ad-slot="8091926161"
					data-ad-format="auto"
					data-full-width-responsive="true"></ins>
			</div>
		</>
	);
}
