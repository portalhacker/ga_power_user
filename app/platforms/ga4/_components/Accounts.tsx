// 'use client'


export default async function Accounts({accessToken}: {accessToken: string}) {
  const response = await fetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Application: "application/json",
    }
  });
  console.log(response.ok);
  console.log(response.status);
  console.log(response.statusText);
  const body = await response.json();
  const accounts = body.accounts;
  console.log(accounts);
  for (const account of accounts) {
    console.log(account);
  }

  return (
    <main>
      <h1>Accounts</h1>
      <br />
      <p>Nulla dolore labore adipisicing ex consequat est ex dolor exercitation. Et aute proident ea. Aliqua ea ea labore reprehenderit aliqua sunt cupidatat excepteur minim. Ad incididunt voluptate ea quis proident velit ex adipisicing. Mollit consectetur incididunt commodo consectetur voluptate. Id proident id voluptate qui irure est laborum consequat. Sit pariatur aliquip ullamco est consequat est nulla.</p>
      <br />
      <ol>
        {accounts.map((account: any) => {
          return (
            <li key={account.name}>
              <h2>{account.displayName}</h2>
              <p>{account.name}</p>
              <p>{account.regionCode}</p>
              <p>{account.createTime}</p>
              <p>{account.updateTime}</p>
              <br />
            </li>
          );
        })}
      </ol>
    </main>
  );
}