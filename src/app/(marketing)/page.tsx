import Link from 'next/link';

import SignIn from '@/src/components/features/auth/sign-in';
import SignOut from '@/src/components/features/auth/sign-out';
import { auth } from '@/src/lib/auth/auth';

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
