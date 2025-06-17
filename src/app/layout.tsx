import type { Metadata } from "next";
import { Barlow } from "next/font/google"
import "../styles/globals.css";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/components/providers/next-auth-provider";
import { OptionAsideProvider } from "@/context/option-aside-context";


const fontSetter = Barlow({
  weight: '400',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Gemelo Digital - Nexa",
  description: "Gemelo Digital de Nexa",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "h-screen w-screen bg-background antialiased",
          fontSetter.className
        )}
      >
        <OptionAsideProvider>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
          </NextAuthProvider>
        </OptionAsideProvider>
      </body>
    </html>
  );
}
