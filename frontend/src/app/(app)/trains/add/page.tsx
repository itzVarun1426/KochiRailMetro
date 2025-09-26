// src/app/(app)/trains/add/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Train } from "@/lib/types";
import { trainService } from "@/lib/services/trainService";
import { invalidateApiCache } from "@/hooks/use-api";

// This is a temporary prop to simulate adding a train
// In a real app, this would come from a layout context or a global state manager
interface AddTrainPageProps {
  onAddTrain: (train: Train) => void;
}

const trainSchema = z.object({
  id: z.string().min(1, "Train ID is required."),
  model: z.string().min(1, "Train Model is required."),
  manufacturingYear: z.coerce.number().int().min(1950, "Invalid year."),
  vendor: z.string().min(1, "Vendor is required."),
  coachCount: z.coerce.number().int().min(1, "Must have at least 1 coach."),
  capacity: z.object({
    seating: z.coerce.number().int().min(0),
    standing: z.coerce.number().int().min(0),
  }),
  maxSpeed: z.coerce.number().int().positive("Max speed must be positive."),
  depot: z.string().min(1, "Depot assignment is required."),
  inductionDate: z.string().min(1, "Induction date is required."),
  fitnessCertificate: z.object({
    validFrom: z.string().min(1, "Start date is required."),
    validUntil: z.string().min(1, "Expiry date is required."),
  }),
  safetyCertificateExpiry: z.string().min(1, "Expiry date is required."),
  nextMaintenanceDate: z.string().min(1, "Next maintenance date is required."),
  maintenanceInterval: z.object({
    distance: z.coerce.number().int().positive(),
    time: z.coerce.number().int().positive(),
  }),
  mileage: z.coerce.number().int().min(0).default(0),
  mileageThreshold: z.coerce.number().int().positive(),
  cleaningStatus: z.enum(["Cleaned", "Pending"]),
  brandingStatus: z.enum(["Yes", "No"]),
  assignedRoute: z.string().optional(),
});

type TrainFormValues = z.infer<typeof trainSchema>;

export default function AddTrainPage({ onAddTrain }: AddTrainPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  
  const form = useForm<TrainFormValues>({
    resolver: zodResolver(trainSchema),
    defaultValues: {
      id: "",
      model: "",
      vendor: "",
      manufacturingYear: new Date().getFullYear(),
      coachCount: 3,
      capacity: { seating: 150, standing: 650 },
      maxSpeed: 90,
      depot: "Muttom",
      inductionDate: new Date().toISOString().split('T')[0],
      fitnessCertificate: {
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      },
      safetyCertificateExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      nextMaintenanceDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      maintenanceInterval: { distance: 20000, time: 6 },
      mileage: 0,
      mileageThreshold: 150000,
      cleaningStatus: "Cleaned",
      brandingStatus: "No",
      assignedRoute: "",
    },
  });

  async function onSubmit(data: TrainFormValues) {
    const formatLocalDateTime = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`; // no timezone, no millis
    };

    // Minimal payload matching backend Train entity expectations
    const payload = {
      trainNumber: data.id,
      commissioningDate: data.inductionDate, // LocalDate (YYYY-MM-DD)
      status: "ACTIVE",
      currentOdometer: Number(data.mileage),
      lastMaintenanceDate: data.nextMaintenanceDate, // LocalDate
      odometerAtLastMaintenance: Number(data.mileage),
      maintenanceInterval: Number(data.maintenanceInterval.distance),
      lastCleaningDateTime: formatLocalDateTime(new Date()), // LocalDateTime
      cleaningPeriod: 12,
      dailyMaxMileage: 1000,
      depotLocation: data.depot,
    } as any;
    try {
      await trainService.createTrain(payload);
      invalidateApiCache(['all-trains']);
      if(onAddTrain) onAddTrain(payload as Train);
      toast({
        title: "Metro Added",
        description: `Metro ${data.id} has been successfully added to the fleet.`,
      });
      router.push('/all-trains');
    } catch (err) {
      toast({
        title: "Failed to add metro",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  }

  if (!mounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Add New Metro</h1>
      </div>
       <p className="text-muted-foreground">
        Enter the details for the new metro to add it to the fleet.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Identification</CardTitle>
                <CardDescription>Basic identification details for the metro.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <FormField control={form.control} name="id" render={({ field }) => (
                  <FormItem><FormLabel>Train ID / Number</FormLabel><FormControl><Input placeholder="e.g., T-026" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="model" render={({ field }) => (
                  <FormItem><FormLabel>Train Model / Type</FormLabel><FormControl><Input placeholder="e.g., Alstom Metropolis" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="manufacturingYear" render={({ field }) => (
                  <FormItem><FormLabel>Manufacturing Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="vendor" render={({ field }) => (
                  <FormItem><FormLabel>Vendor / Supplier</FormLabel><FormControl><Input placeholder="e.g., Alstom" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity & Performance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <FormField control={form.control} name="coachCount" render={({ field }) => (
                  <FormItem><FormLabel>Number of Coaches</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="capacity.seating" render={({ field }) => (
                  <FormItem><FormLabel>Seating Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="capacity.standing" render={({ field }) => (
                  <FormItem><FormLabel>Standing Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="maxSpeed" render={({ field }) => (
                  <FormItem><FormLabel>Maximum Speed (km/h)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Operational Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <FormField control={form.control} name="depot" render={({ field }) => (
                  <FormItem><FormLabel>Depot / Yard Assigned</FormLabel><FormControl><Input placeholder="e.g., Muttom" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="inductionDate" render={({ field }) => (
                  <FormItem><FormLabel>Date of Induction</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="assignedRoute" render={({ field }) => (
                  <FormItem><FormLabel>Assigned Route (Optional)</FormLabel><FormControl><Input placeholder="e.g., Aluva - Pettah" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificates & Validity</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <FormField control={form.control} name="fitnessCertificate.validFrom" render={({ field }) => (
                  <FormItem><FormLabel>Fitness Cert. Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="fitnessCertificate.validUntil" render={({ field }) => (
                  <FormItem><FormLabel>Fitness Cert. Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="safetyCertificateExpiry" render={({ field }) => (
                  <FormItem><FormLabel>Safety/Signaling Cert. Expiry</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <FormField control={form.control} name="nextMaintenanceDate" render={({ field }) => (
                  <FormItem><FormLabel>Next Scheduled Maintenance</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="maintenanceInterval.distance" render={({ field }) => (
                  <FormItem><FormLabel>Interval (km)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="maintenanceInterval.time" render={({ field }) => (
                  <FormItem><FormLabel>Interval (months)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="mileage" render={({ field }) => (
                  <FormItem><FormLabel>Current Mileage</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="mileageThreshold" render={({ field }) => (
                  <FormItem><FormLabel>Mileage Threshold for Inspection</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="cleaningStatus" render={({ field }) => (
                  <FormItem><FormLabel>Cleaning Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="Cleaned">Cleaned</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
                  </Select>
                  <FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="brandingStatus" render={({ field }) => (
                  <FormItem><FormLabel>Branding / Advertising Status</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                  </Select>
                  <FormMessage /></FormItem>
                )}/>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
             <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Adding..." : "Add Metro to Fleet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
