import Link from 'next/link';

import SignIn from '@/src/components/features/auth/sign-in';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav className="flex flex-col gap-2">
        <SignIn />
        <Link href="/account-summaries">Accounts</Link>
      </nav>
    </div>
  );
}
