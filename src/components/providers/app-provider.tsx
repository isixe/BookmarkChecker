"use client";

import { createContext, useContext, ReactNode } from "react";

interface AppContextType {
	baseUrl: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children, baseUrl }: { children: ReactNode; baseUrl: string }) {
	return <AppContext.Provider value={{ baseUrl }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within AppProvider");
	}
	return context;
}
