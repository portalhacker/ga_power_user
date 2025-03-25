import { Button } from '@/components/ui/button';
import { signInAction } from './sign-in.actions';

export default function SignIn() {
  return (
    <form action={signInAction}>
      <Button type="submit">Sign-in</Button>
    </form>
  );
}
