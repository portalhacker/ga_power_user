'use client'

import { useEffect } from "react";

export function SetLocalStorage({ storageKey, value }: { storageKey: string, value: any }) {
  value = JSON.stringify(value);
  useEffect(() => {
    console.debug('Setting local storage', storageKey);
    localStorage.setItem(storageKey, value);
    window.location.href = '/platforms/ga4';
  });
  return null;
}

export async function GetLocalStorage({ storageKey }: { storageKey: string }) {
  useEffect(() => {
    console.debug('Getting local storage', storageKey);
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : null;
  });
}
