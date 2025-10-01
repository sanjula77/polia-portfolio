import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'John Doe - Full Stack Developer & Designer',
  description: 'Professional portfolio showcasing full-stack development, AI projects, and design work. Former Microsoft intern with expertise in React, Node.js, and cloud technologies.',
  keywords: 'full stack developer, software engineer, React, Node.js, TypeScript, portfolio',
  authors: [{ name: 'John Doe' }],
  openGraph: {
    title: 'John Doe - Full Stack Developer & Designer',
    description: 'Professional portfolio showcasing full-stack development, AI projects, and design work.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}