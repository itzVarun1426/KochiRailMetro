// src/components/all-trains/train-card.tsx
import * as React from 'react';
import type { Train } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Wrench, ParkingSquare, Waves, Gauge, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';

const getStatusInfo = (status: Train['status']) => {
  switch (status) {
    case 'IN_SERVICE':
      return { icon: <Rocket className="h-4 w-4" />, badgeClass: 'bg-green-100 text-green-800 border-green-200' };
    case 'MAINTENANCE':
      return { icon: <Wrench className="h-4 w-4" />, badgeClass: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'ACTIVE':
      return { icon: <ParkingSquare className="h-4 w-4" />, badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'RETIRED':
        return { icon: <Waves className="h-4 w-4" />, badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
    default:
      return { icon: null, badgeClass: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

const isCertificateExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
}

export const TrainCard = React.memo(({ train }: { train: Train }) => {
  const { icon, badgeClass } = getStatusInfo(train.status);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-primary">{train.trainNumber || String(train.trainId)}</CardTitle>
          <Badge className={cn('gap-1.5', badgeClass)}>
            {icon}
            {train.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{train.depotLocation}</p>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</span>
            <span className="font-medium">{train.depotLocation}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2"><Gauge className="h-4 w-4" /> Mileage</span>
          <span className="font-medium">{train.currentOdometer.toLocaleString()} km</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Next Maintenance</span>
          <span className="font-medium">{new Date(train.lastMaintenanceDate).toLocaleDateString()}</span>
        </div>
        {Array.isArray(train.fitnessCertificates) && train.fitnessCertificates.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Fitness Cert.</span>
            <span className={cn("font-medium", isCertificateExpiringSoon(train.fitnessCertificates[0].expiryDate) && "text-destructive")}>
              Expires {new Date(train.fitnessCertificates[0].expiryDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" className="w-full">
            <Link href={`/trains/${train.trainId}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

TrainCard.displayName = 'TrainCard';
