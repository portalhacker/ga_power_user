import Link from "next/link";

export default function Home() {  
  return (
    <div>
      <h1>Home</h1>
      <nav className="flex flex-col gap-2">
      <Link href="/login">Auth</Link>
      <Link href="/accounts">Accounts</Link>
      </nav>
    </div>

  );
}
