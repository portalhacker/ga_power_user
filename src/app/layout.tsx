import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import UserAvatar from '@/components/features/auth/user-avatar';
import { ThemeProvider } from '@/components/features/darkMode/themeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GA Power User',
  description: 'Supercharge your Google Analytics workflows',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav>
            <UserAvatar />
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
