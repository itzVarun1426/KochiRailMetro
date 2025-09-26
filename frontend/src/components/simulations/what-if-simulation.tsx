"use client";

import { useState, useTransition } from "react";
import { runWhatIfSimulation } from "@/ai/flows/run-what-if-simulation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, AlertOctagon, Users, Route } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type SimulationOutput = {
  predictedScheduleImpact: string;
  resourceAllocationChanges: string;
  potentialDisruptions: string;
};

export function WhatIfSimulation() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    maintenanceDelay: "Train T-003 HVAC repair taking 2 hours longer",
    certificateRisk: "T-002 certificate renewal is pending, might be delayed",
    cleaningSlot: "Washing Line 1 is blocked for the next 3 hours",
    trackClosure: "Track SL2 closed for inspection from 2 PM to 4 PM",
    demand: "High passenger traffic expected due to a cricket match",
    weather: "Heavy rain expected in the afternoon",
  });
  const [result, setResult] = useState<SimulationOutput | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await runWhatIfSimulation(formData);
      setResult(res);
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>What-If Scenario Builder</CardTitle>
          <CardDescription>
            Input conditions to simulate their impact on operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceDelay">Maintenance Delay</Label>
              <Input
                id="maintenanceDelay"
                name="maintenanceDelay"
                value={formData.maintenanceDelay}
                onChange={handleChange}
                placeholder="e.g., T-007 brake replacement delayed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackClosure">Track Closure</Label>
              <Input
                id="trackClosure"
                name="trackClosure"
                value={formData.trackClosure}
                onChange={handleChange}
                placeholder="e.g., Washing line 1 closed"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="demand">Demand</Label>
              <Input
                id="demand"
                name="demand"
                value={formData.demand}
                onChange={handleChange}
                placeholder="e.g., VVIP movement, event traffic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weather">Weather</Label>
              <Input
                id="weather"
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                placeholder="e.g., Heavy rain warning"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificateRisk">Certificate Risk</Label>
            <Textarea
              id="certificateRisk"
              name="certificateRisk"
              value={formData.certificateRisk}
              onChange={handleChange}
              placeholder="e.g., T-002 renewal pending"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cleaningSlot">Cleaning Slot</Label>
            <Textarea
              id="cleaningSlot"
              name="cleaningSlot"
              value={formData.cleaningSlot}
              onChange={handleChange}
              placeholder="e.g., WL1 occupied until 4 PM"
              rows={2}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Run Simulation
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
          <CardDescription>
            AI-predicted outcomes based on your inputs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : result ? (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center gap-2"><Route className="h-5 w-5 text-primary" />Predicted Schedule Impact</h3>
                    <p className="text-sm text-muted-foreground mt-1">{result.predictedScheduleImpact}</p>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Resource Allocation Changes</h3>
                    <p className="text-sm text-muted-foreground mt-1">{result.resourceAllocationChanges}</p>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center gap-2"><AlertOctagon className="h-5 w-5 text-destructive" />Potential Disruptions</h3>
                    <p className="text-sm text-muted-foreground mt-1">{result.potentialDisruptions}</p>
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg p-4">
                <Zap className="h-10 w-10 mb-2"/>
                <p className="font-semibold">Results will be displayed here</p>
                <p className="text-sm">Enter conditions and run the simulation.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
