"use client";

import { useTheme } from "next-themes";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

interface ClerkThemeProviderProps {
  children: React.ReactNode;
}

/** Clerk UI follows the app theme and uses the Broadwave coral as its primary colour. */
export function ClerkThemeProvider({ children }: ClerkThemeProviderProps): React.JSX.Element {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={
        {
          baseTheme: isDark ? dark : undefined,
          variables: {
            colorPrimary: "#ff6a45",
            colorBackground: isDark ? "#12201f" : "#ffffff",
            colorInputBackground: isDark ? "#0b1516" : "#f1f6f5",
            colorText: isDark ? "#e8f2ef" : "#0f1f1e",
            borderRadius: "0.85rem",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          },
          elements: {
            card: "shadow-none border border-[color:var(--border)]",
            formButtonPrimary: "rounded-full font-semibold text-[#1a0c08] hover:opacity-90",
          },
        } as Record<string, unknown>
      }
    >
      {children}
    </ClerkProvider>
  );
}
