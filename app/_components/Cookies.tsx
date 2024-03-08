'use client'

export function SetCookie({ name, value, expiry, encode }: { name: string, value: any, expiry: number, encode: boolean }) {
  value = JSON.stringify(value);
  const date = new Date();
  const expires = date.setTime(expiry);
  document.cookie = `${name}=${encode ? btoa(value) : value}; expires=${expires}; path=/`;
  return null;
}

export function GetCookie({ name, decode }: { name: string, decode: boolean }) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop()?.split(';').shift();
    if (part) {
      return decode ? atob(part) : part;
    }
  }
  return null;
}