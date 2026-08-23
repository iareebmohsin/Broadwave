/**
 * @file components/theme-provider.tsx
 * @description Theme provider component that wraps the application with
 * next-themes support for light/dark mode switching.
 *
 * This is a thin client-side wrapper around `next-themes`' ThemeProvider,
 * necessary because providers that use React Context must be rendered
 * as Client Components in the Next.js App Router.
 *
 * @module ThemeProvider
 * @requires next-themes
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Props for the {@link ThemeProvider} component.
 */
export type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * ThemeProvider component that enables light/dark mode support.
 *
 * Wraps the application with `next-themes` to provide:
 * - System preference detection
 * - Manual theme toggling
 * - Theme persistence via cookies/localStorage
 * - Automatic class injection on the `<html>` element
 *
 * @component
 * @param {ThemeProviderProps} props - All props
 *   are forwarded directly to the underlying `next-themes` ThemeProvider.
 *
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): React.JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
