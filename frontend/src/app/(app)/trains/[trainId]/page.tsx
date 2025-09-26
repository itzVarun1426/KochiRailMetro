// src/app/(app)/trains/[trainId]/page.tsx
import { trainService } from "@/lib/services/trainService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Calendar, History, Info, MapPin, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Train } from "@/lib/types";

const isCertificateExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-start py-2 border-b text-sm">
        <span className="text-muted-foreground shrink-0 pr-4">{label}</span>
        <span className="font-medium text-right break-all">{value}</span>
    </div>
);

const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
}


export default async function TrainDetailPage({ params }: { params: { trainId: string } }) {
  const trainId = params.trainId;
  
  try {
    const train = await trainService.getTrainById(trainId) as Train;
    
    if (!train) {
      notFound();
    }

  // Only use fields present in backend response; omit branding/certificates/extra specs

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
            Train Details: <span className="text-primary">{train.trainNumber} (#{train.trainId})</span>
            </h1>
            <p className="text-muted-foreground mt-1">A concise overview based on available data.</p>
        </div>
        <Badge className={cn(
            train.status === 'IN_SERVICE' && 'bg-green-100 text-green-800 border-green-200',
            train.status === 'MAINTENANCE' && 'bg-orange-100 text-orange-800 border-orange-200',
            train.status === 'ACTIVE' && 'bg-blue-100 text-blue-800 border-blue-200',
            train.status === 'RETIRED' && 'bg-cyan-100 text-cyan-800 border-cyan-200',
            'text-base px-4 py-2 self-start sm:self-center'
        )}>{train.status}</Badge>
      </div>
        
      {/* Removed Branding Section (not in backend data) */}


      {/* Removed Certificates section (not in backend data) */}
      
      {/* Core details based on available backend fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" />Identity & Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <DetailRow label="Train ID" value={train.trainId} />
            <DetailRow label="Train Number" value={train.trainNumber} />
            <DetailRow label="Commissioned On" value={formatDate(train.commissioningDate)} />
          </div>
          <div>
            <DetailRow label="Depot" value={<span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{train.depotLocation}</span>} />
            <DetailRow label="Last Updated" value={formatDateTime(train.lastUpdated)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" />Mileage & Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <DetailRow label="Current Odometer" value={`${train.currentOdometer.toLocaleString()} km`} />
            <DetailRow label="Odometer At Last Maintenance" value={`${train.odometerAtLastMaintenance.toLocaleString()} km`} />
          </div>
          <div>
            <DetailRow label="Maintenance Interval" value={`${Number(train.maintenanceInterval).toLocaleString()} km`} />
            <DetailRow label="Last Maintenance Date" value={formatDate(train.lastMaintenanceDate)} />
          </div>
        </CardContent>
      </Card>

       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {/* Simple cleaning/utilization card using available fields */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Cleaning & Utilization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <DetailRow label="Last Cleaning" value={formatDateTime(train.lastCleaningDateTime)} />
              <DetailRow label="Cleaning Period" value={`${train.cleaningPeriod} hrs`} />
            </div>
            <div>
              <DetailRow label="Daily Max Mileage" value={<span className="inline-flex items-center gap-2"><Gauge className="h-4 w-4" />{`${train.dailyMaxMileage.toLocaleString()} km`}</span>} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error fetching train details:', error);
    notFound();
  }
}
