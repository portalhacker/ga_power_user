import { auth } from '@/lib/auth/auth';

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  if (!session.user.image) {
    return (
      <div>
        <span>{session.user.email}</span>
      </div>
    );
  }

  return (
    <div>
      <img src={session.user.image} alt="User Avatar" />
    </div>
  );
}
