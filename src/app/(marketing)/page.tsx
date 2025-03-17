import { ThemeToggle } from '@/components/features/darkMode/themeToggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav className="flex flex-col gap-2">
        <ThemeToggle />
        <Link href="/api/auth/login">Log in</Link>
        <Link href="/account-summaries">Accounts</Link>
        <Button>Test</Button>
      </nav>
    </div>
  );
}
