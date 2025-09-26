import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatIfSimulation } from "@/components/simulations/what-if-simulation";
import { CertificateClearance } from "@/components/simulations/certificate-clearance";

export default function SimulationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Simulations & Predictions</h1>
      </div>
      <p className="text-muted-foreground">
        Experiment with input conditions to predict downstream consequences and probabilities.
      </p>
      <Tabs defaultValue="what-if" className="space-y-4">
        <TabsList>
          <TabsTrigger value="what-if">What-If Simulation</TabsTrigger>
          <TabsTrigger value="clearance">Certificate Clearance</TabsTrigger>
        </TabsList>
        <TabsContent value="what-if">
            <WhatIfSimulation />
        </TabsContent>
        <TabsContent value="clearance">
            <CertificateClearance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
