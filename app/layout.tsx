import type React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-playfair",
});

export const metadata: Metadata = {
	title: "Plateforme d'Aide à la Décision",
	description:
		"Outil de prise de décision basé sur la méthode de Seymour Schulich",
	generator: "v0.app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="fr"
			className={`${inter.variable} ${playfair.variable} antialiased`}
		>
			<body className="transition-colors duration-300">{children}</body>
		</html>
	);
}
