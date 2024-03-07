import { getAuthenticatedClient } from '../../../services/google/auth/oauth2';

const authorizeUrl = getAuthenticatedClient();

export default function Home() {
  return (
    <main>
      <h1>Log in</h1>
      <br />
      <p>Nulla dolore labore adipisicing ex consequat est ex dolor exercitation. Et aute proident ea. Aliqua ea ea labore reprehenderit aliqua sunt cupidatat excepteur minim. Ad incididunt voluptate ea quis proident velit ex adipisicing. Mollit consectetur incididunt commodo consectetur voluptate. Id proident id voluptate qui irure est laborum consequat. Sit pariatur aliquip ullamco est consequat est nulla.</p>
      <br />
      <a href={authorizeUrl}>Log in with Google</a>
    </main>
  );
}
