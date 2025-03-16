import Link from 'next/link';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../features/darkMode/themeToggle';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav className="flex flex-col gap-2">
        <ThemeToggle />
        <Link href="/api/auth/login">Log in</Link>
        <Link href="/accounts">Accounts</Link>
        <Button>Test</Button>
      </nav>
    </div>
  );
}
