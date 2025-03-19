'use server';

import { signIn } from '@/lib/auth/auth';

export const signInAction = async () => {
  await signIn('google');
};
