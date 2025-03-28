import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

import UserAvatar from '@/components/features/auth/user-avatar';
import { ThemeProvider } from '@/components/features/darkMode/themeProvider';
import { ThemeToggle } from '@/components/features/darkMode/themeToggle';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'GA Power',
  description: 'Supercharge your Google Analytics workflows',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="p-4">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="flex justify-between mb-4 items-center">
              <div className="flex gap-2">
                <Link href="/">Home</Link>
                <Link href="/account-summaries">Accounts</Link>
              </div>
              <div className="flex gap-2 items-center">
                <ThemeToggle />
                <UserAvatar />
              </div>
            </nav>
            {children}
          </ThemeProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
