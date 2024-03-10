import Header from '@/app/_components/Header';
import { headers } from 'next/headers';

const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

const scopes = [
    "https://www.googleapis.com/auth/analytics",            // View and manage your Google Analytics data
    "https://www.googleapis.com/auth/analytics.readonly",   // View your Google Analytics data
  //   "https://www.googleapis.com/auth/analytics.edit",    // Edit Google Analytics management entities
];

export default function Home() {
  const headersList = headers();
  
  const params: { [key: string]: string } = {
      'client_id': '646423554576-uoddc2r0236fngusku0pr2vehci4tcuo.apps.googleusercontent.com',
      'redirect_uri': `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}/auth/oauth2callback`,
      'response_type': 'token',
      'scope': scopes.join(' '),
      'include_granted_scopes': 'true',
      'state': 'pass-through value'
  };

  return (
    <main>
      <Header></Header>
      <h1>Log in</h1>
      <br />
      <p>Nulla dolore labore adipisicing ex consequat est ex dolor exercitation. Et aute proident ea. Aliqua ea ea labore reprehenderit aliqua sunt cupidatat excepteur minim. Ad incididunt voluptate ea quis proident velit ex adipisicing. Mollit consectetur incididunt commodo consectetur voluptate. Id proident id voluptate qui irure est laborum consequat. Sit pariatur aliquip ullamco est consequat est nulla.</p>
      <br />
      <form action={oauth2Endpoint} method="get">
        <input type="hidden" name="client_id" value={params.client_id} />
        <input type="hidden" name="redirect_uri" value={params.redirect_uri} />
        <input type="hidden" name="response_type" value={params.response_type} />
        <input type="hidden" name="scope" value={params.scope} />
        <input type="hidden" name="include_granted_scopes" value={params.include_granted_scopes} />
        <input type="hidden" name="state" value={params.state} />
        <button type="submit">Log in with Google</button>
      </form>
    </main>
  );
}
