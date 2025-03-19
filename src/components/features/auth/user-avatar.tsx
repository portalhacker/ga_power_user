import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';

import { auth } from '@/lib/auth/auth';

export default async function UserAvatar() {
  const session = await auth();
  if (!session?.user) return null;

  const initials = session.user.name
    ?.trim()
    .toUpperCase()
    .split(' ')
    .map((name) => name[0])
    .join('');

  return (
    <Avatar>
      <AvatarImage
        src={session.user.image || undefined}
        alt={session.user.name || undefined}
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
