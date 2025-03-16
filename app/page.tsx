import Link from "next/link";

export default function Home() {  
  return (
    <div>
      <h1>Home</h1>
      <nav className="flex flex-col gap-2">
      <Link href="/api/auth/login">Log in</Link>
      <Link href="/accounts">Accounts</Link>
      </nav>
    </div>

  );
}
