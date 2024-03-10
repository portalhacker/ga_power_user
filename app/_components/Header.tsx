import Link from "next/link";

export default function Header() {
  return (
    <header>
      <h1>GA Power User</h1>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/auth/login">Login</Link></li>
          <li><Link href="/platforms/ga4">GA4</Link></li>
        </ul>
      </nav>
      <br />
    </header>
  );
}