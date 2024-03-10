'use client';
import Header from "@/app/_components/Header";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    if(window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params: { [key: string]: string } = {};
      hash.split('&').map(hk => {
        const temp = hk.split('=');
        params[temp[0]] = temp[1];
      });
      console.log(params);
      document.cookie = `google_credentials=${btoa(JSON.stringify(params))}; max-age=${params.expires_in}; path=/`;
      window.location.hash = '';
      window.location.replace(window.location.origin + "/platforms/ga4");
    }
  }, []);
  
  return (
    <main>
      <Header></Header>
      <h1>Log in</h1>
      <br />
      <p>Nulla dolore labore adipisicing ex consequat est ex dolor exercitation. Et aute proident ea. Aliqua ea ea labore reprehenderit aliqua sunt cupidatat excepteur minim. Ad incididunt voluptate ea quis proident velit ex adipisicing. Mollit consectetur incididunt commodo consectetur voluptate. Id proident id voluptate qui irure est laborum consequat. Sit pariatur aliquip ullamco est consequat est nulla.</p>
      <br />
    </main>
  );
}
