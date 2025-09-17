'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the original component with SSR disabled
const RecentActivityCard = dynamic(
  () => import('./RecentActivityCard').then((mod) => mod.default),
  { ssr: false }
);

export default function RecentActivityCardClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecentActivityCard />
    </Suspense>
  );
}
