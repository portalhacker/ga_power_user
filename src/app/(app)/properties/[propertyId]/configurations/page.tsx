import SignIn from '@/components/features/auth/sign-in';
import { auth } from '@/lib/auth/auth';
import { GoogleAnalyticsClient } from '@/lib/google/analytics/google-analytics-client';
import { prisma } from '@/src/lib/db/prisma';

export default async function Page({
  params,
}: {
  params: Promise<{ propertyId: number }>;
}) {
  const { propertyId } = await params;

  const session = await auth();
  if (
    !session ||
    session === null ||
    !session.user ||
    session?.error === 'RefreshTokenError'
  ) {
    return <SignIn />;
  }

  const tokens = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: 'google',
    },
    select: {
      refresh_token: true,
      access_token: true,
    },
  });

  if (!tokens || !tokens.refresh_token || !tokens.access_token) {
    return <p>No valid Google Analytics credentials.</p>;
  }

  // Initialize the GoogleAnalyticsClient class
  const client = new GoogleAnalyticsClient({
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
  });

  const propertyDetails = await client.getProperty(propertyId);
  // const allPropertySettings = await client.getAllPropertySettings(propertyId);

  return (
    <>
      <div>My Property: {propertyId}</div>
      {/* <pre>{JSON.stringify(propertyDetails, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(allPropertySettings, null, 2)}</pre> */}
    </>
  );
}
