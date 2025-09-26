// src/app/(app)/ranking/page.tsx
"use client";
import { TrainRanking } from '@/components/ranking/train-ranking';

export default function RankingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Train Induction Ranking</h1>
      </div>
      <p className="text-muted-foreground">
        Use the AI-powered optimizer to rank available trains for induction based on multiple factors.
      </p>
      <TrainRanking />
    </div>
  );
}
