import "./globals.css";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Organization, WebSite, WithContext } from "schema-dts";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn, getAppUrl } from "@/lib/utils";

const appUrl = getAppUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f6f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1415" },
  ],
};

const structuredData: WithContext<WebSite | Organization>[] = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Broadwave",
    url: appUrl,
    description: "Go live in a minute. Watch, chat and follow creators in real time.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${appUrl}/search?term={search_term_string}`,
      },
      query: "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Broadwave",
    url: appUrl,
    logo: `${appUrl}/broadwave.svg`,
  },
];

const grotesk = localFont({
  src: "./fonts/SpaceGrotesk.woff2",
  variable: "--font-sans",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Broadwave - Live streaming for creators",
    template: "%s | Broadwave",
  },
  description:
    "Broadwave is a real-time live streaming platform. Go live from OBS in a minute, watch creators, chat, and follow.",
  keywords: ["live streaming", "creators", "real-time chat", "Broadwave", "broadcasting", "WebRTC"],
  authors: [{ name: "Broadwave" }],
  creator: "Broadwave",
  publisher: "Broadwave",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Broadwave",
    title: "Broadwave - Live streaming for creators",
    description: "Go live in a minute. Watch, chat and follow creators in real time.",
    images: [
      {
        url: "/broadwave.svg",
        width: 1200,
        height: 630,
        alt: "Broadwave",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Broadwave - Live streaming for creators",
    description: "Go live in a minute. Watch, chat and follow creators in real time.",
    images: ["/broadwave.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/broadwave.svg",
  },
};

const THEME_STORAGE_KEY = "broadwave-theme";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html
      className={cn("h-full", "antialiased", "font-sans", grotesk.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={structuredData} />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
          storageKey={THEME_STORAGE_KEY}
        >
          <ClerkThemeProvider>
            <Toaster />
            {children}
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
