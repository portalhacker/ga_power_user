'use client'

import { useEffect } from "react";

export const SetLocalStorage: React.FC<{ key: string, value: string }> = ({ key, value }) => {
  useEffect(() => {
    console.log('Setting local storage', key, value);
    localStorage.setItem(key, value);
 }, [key, value]);

  return null;
}
