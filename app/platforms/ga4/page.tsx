import { AnalyticsAdminServiceClient } from "@google-analytics/admin";
import { cookies } from 'next/headers';


export default function Home() {
  const cookieStore = cookies();
  const encondedGoogleCredentials = cookieStore.get('google_credentials')?.value;
  const google_credentials = encondedGoogleCredentials ? JSON.parse(atob(encondedGoogleCredentials)) : null;
  console.log(google_credentials);

  async function getAccounts() {
    const client = new AnalyticsAdminServiceClient({
      credentials: google_credentials,
    });
    const [accounts] = await client.listAccounts();
    return accounts;
  }
  console.log(getAccounts());

  return (
    <main>
      <h1>GA4</h1>
      <br />
      <p>Nulla dolore labore adipisicing ex consequat est ex dolor exercitation. Et aute proident ea. Aliqua ea ea labore reprehenderit aliqua sunt cupidatat excepteur minim. Ad incididunt voluptate ea quis proident velit ex adipisicing. Mollit consectetur incididunt commodo consectetur voluptate. Id proident id voluptate qui irure est laborum consequat. Sit pariatur aliquip ullamco est consequat est nulla.</p>
      <br />
      {/* <Accounts /> */}
    </main>
  );
}
