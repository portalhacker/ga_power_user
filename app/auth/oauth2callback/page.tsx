import { saveCredentials } from '../../../services/google/auth/oauth2';
import { SetLocalStorage } from './LocalStorage';

export default async function Home({ searchParams}: { searchParams: { [key: string]: string } }) {
  const code = searchParams['code']
  let credentials
  if (code) credentials = await saveCredentials(code);

  return (
    <main>
      <h1>Log in</h1>
      <br />
      <p>Nulla dolore labore adipisicing ex consequat est ex dolor exercitation. Et aute proident ea. Aliqua ea ea labore reprehenderit aliqua sunt cupidatat excepteur minim. Ad incididunt voluptate ea quis proident velit ex adipisicing. Mollit consectetur incididunt commodo consectetur voluptate. Id proident id voluptate qui irure est laborum consequat. Sit pariatur aliquip ullamco est consequat est nulla.</p>
      <br />
      <SetLocalStorage key="googleCredentials" value={JSON.stringify(credentials)} />
    </main>
  );
}
