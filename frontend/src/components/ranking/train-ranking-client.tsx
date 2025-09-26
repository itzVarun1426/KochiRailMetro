"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const TrainRanking = dynamic(() => import('@/components/ranking/train-ranking').then(mod => mod.TrainRanking), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
});

export default function TrainRankingClient() {
  return <TrainRanking />;
}
