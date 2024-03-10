import { cookies } from "next/headers";

export async function setCookie(name: string, value: string, options: { maxAge: number }) {
  cookies().set(name, value, options);
  console.log('cookie set');
}