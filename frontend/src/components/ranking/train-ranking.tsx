"use client";

import { useState, useTransition, useEffect } from "react";
import { rankTrainsForInduction } from "@/ai/flows/rank-trains-for-induction";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trainService } from "@/lib/services/trainService";
import type { Train } from "@/lib/types";

type TrainForRanking = {
    trainId: string;
    fitnessCertificateStatus: string;
    jobCardStatus: string;
    brandingPriority: number;
    mileage: number;
    lastCleaningDate: string;
    stablingConstraints: string;
    reliabilityScore: number;
}

type RankedTrain = {
  trainId: string;
  rank: number;
  reasoning: string;
};

export function TrainRanking() {
  const [isPending, startTransition] = useTransition();
  const [rankedTrains, setRankedTrains] = useState<RankedTrain[]>([]);
  const [trainsForRanking, setTrainsForRanking] = useState<TrainForRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real train data from API
    const fetchTrainData = async () => {
      try {
        setLoading(true);
        const trains = await trainService.getAllTrains();

        const trainsForRanking = trains.map((train) => {
          const hasActiveCertificate = (train.fitnessCertificates || []).some(
            (c: any) => c.status === 'ACTIVE'
          );
          const hasOpenJobCards = (train.jobCards || []).some(
            (jc: any) => jc.status !== 'Completed'
          );

          return {
            trainId: String(train.trainId),
            fitnessCertificateStatus: hasActiveCertificate ? 'Valid' : 'Expired',
            jobCardStatus: hasOpenJobCards ? 'Open' : 'Completed',
            brandingPriority: (train.brandingAssignments || []).length > 0 ? (Math.floor(Math.random() * 10) + 1) : 1,
            mileage: train.currentOdometer,
            lastCleaningDate: train.lastCleaningDateTime?.split('T')[0] || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            stablingConstraints: 'None',
            reliabilityScore: (train.status === 'IN_SERVICE' || train.status === 'ACTIVE')
              ? Math.floor(Math.random() * 11) + 90
              : Math.floor(Math.random() * 20) + 70,
          } as TrainForRanking;
        });
        
        setTrainsForRanking(trainsForRanking);
      } catch (error) {
        console.error('Error fetching train data:', error);
        // Set empty array on error
        setTrainsForRanking([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainData();
  }, []);


  const handleRanking = () => {
    startTransition(async () => {
      const result = await rankTrainsForInduction({ trains: trainsForRanking });
      setRankedTrains(result.rankedTrains);
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Trains for Induction</CardTitle>
          <CardDescription>
            Current status of all trains in the fleet awaiting induction decision.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Train ID</TableHead>
                  <TableHead>Fitness Cert.</TableHead>
                  <TableHead>Maintenance</TableHead>
                  <TableHead>Branding Prio.</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Cleaning</TableHead>
                  <TableHead>Accessibility</TableHead>
                  <TableHead>Reliability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainsForRanking.map((train) => (
                  <TableRow key={train.trainId}>
                    <TableCell className="font-medium">{train.trainId}</TableCell>
                    <TableCell>
                      <Badge variant={train.fitnessCertificateStatus === 'Valid' ? 'default' : 'destructive'} className={train.fitnessCertificateStatus === 'Valid' ? 'bg-green-600' : ''}>
                          {train.fitnessCertificateStatus}
                      </Badge>
                    </TableCell>
                     <TableCell>
                      <Badge variant={train.jobCardStatus === 'Completed' ? 'default' : 'secondary'} className={train.jobCardStatus === 'Completed' ? 'bg-green-600' : ''}>
                          {train.jobCardStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{train.brandingPriority}</TableCell>
                    <TableCell>{train.mileage.toLocaleString()} km</TableCell>
                    <TableCell>{train.lastCleaningDate}</TableCell>
                    <TableCell>{train.stablingConstraints}</TableCell>
                    <TableCell>{train.reliabilityScore}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleRanking} disabled={isPending || loading || trainsForRanking.length === 0} className="mt-4 w-68">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Loading Train Data...' : 'Generate Induction Rank'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Induction Ranking</CardTitle>
          <CardDescription>
            Optimized ranking to maximize operational readiness.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {rankedTrains.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-auto pr-4">
                    {rankedTrains.map((train, index) => (
                         <div key={index} className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                                {train.rank}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-lg text-primary">{train.trainId}</p>
                                <p className="text-sm text-muted-foreground">{train.reasoning}</p>
                            </div>
                         </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
                    {loading ? (
                      <Loader2 className="h-10 w-10 animate-spin mb-2" />
                    ) : trainsForRanking.length === 0 ? (
                      <Sparkles className="h-10 w-10 mb-2"/>
                    ) : (
                      <Sparkles className="h-10 w-10 mb-2"/>
                    )}
                    <p className="font-semibold">
                      {loading ? 'Loading train data...' : 
                       trainsForRanking.length === 0 ? 'No trains available' : 
                       'Ranking results will appear here'}
                    </p>
                    <p className="text-sm">
                      {loading ? 'Fetching data from database...' : 
                       trainsForRanking.length === 0 ? 'No trains found in the system.' : 
                       'Click the button to generate the ranking.'}
                    </p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
