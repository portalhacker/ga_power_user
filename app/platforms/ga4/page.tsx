import Header from '@/app/_components/Header';
import { cookies } from "next/headers";
import Accounts from './_components/Accounts';

type GoogleCredentials = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

export default function Home() {
  const cookieStore = cookies();
  const encodedGoogleCredentials = cookieStore.get('google_credentials')?.value;
  const googleCredentials: GoogleCredentials = encodedGoogleCredentials ? JSON.parse(atob(encodedGoogleCredentials)) : null;
  console.log(googleCredentials);

  return (
    <main>
      <Header></Header>
      <h1>GA4</h1>
      <br />
      <p>Nulla dolore labore adipisicing ex consequat est ex dolor exercitation. Et aute proident ea. Aliqua ea ea labore reprehenderit aliqua sunt cupidatat excepteur minim. Ad incididunt voluptate ea quis proident velit ex adipisicing. Mollit consectetur incididunt commodo consectetur voluptate. Id proident id voluptate qui irure est laborum consequat. Sit pariatur aliquip ullamco est consequat est nulla.</p>
      <br />
      <Accounts accessToken={googleCredentials.access_token} />
      {/* {setCookie('google_credentials', encodedGoogleCredentials || '', { maxAge: googleCredentials?.expires_in })} */}
    </main>
  );
}
