import Link from 'next/link';

import { ThemeToggle } from '@/components/features/darkMode/themeToggle';
import SignIn from '@/src/components/features/auth/sign-in';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav className="flex flex-col gap-2">
        <ThemeToggle />
        <SignIn />
        <Link href="/account-summaries">Accounts</Link>
      </nav>
    </div>
  );
}
