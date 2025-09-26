import { DepotMap } from "@/components/depot/depot-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DepotPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Depot Map</h1>
      </div>
      <p className="text-muted-foreground">
        Interactive visualization of the depot layout with real-time train locations. Drag and drop to simulate shunting.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Track Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-bold">Stabling Lines (SL)</p>
              <p className="text-muted-foreground">Tracks where trains are parked when not in service.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-bold">Maintenance Lines (ML)</p>
              <p className="text-muted-foreground">Tracks equipped for repair and maintenance activities.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-bold">Washing Lines (WL)</p>
              <p className="text-muted-foreground">Tracks where trains undergo exterior cleaning.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-bold">Mainline (Main-N/S)</p>
              <p className="text-muted-foreground">Tracks for trains entering or leaving service.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <DepotMap />
      </div>
    </div>
  );
}
