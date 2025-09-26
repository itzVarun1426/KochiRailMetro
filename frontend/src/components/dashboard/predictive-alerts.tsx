"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generatePredictiveAlerts } from "@/ai/flows/generate-predictive-alerts";
import { AlertCircle, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Alert = {
  affected_component: string;
  risk_score: number;
  recommended_actions: string;
};

export function PredictiveAlerts() {
  const [isPending, startTransition] = useTransition();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [conditions, setConditions] = useState(
    "Train T-007: Wheel vibration sensors show a 15% increase in amplitude over the last 48 hours. Axle temperature is nominal. Maintenance logs show last wheel inspection was 3 months ago.\nTrain T-003: HVAC unit 2 reports intermittent coolant pressure drops. No fault codes are registered. Ambient temperature has been high for the past week."
  );

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null);
      setAlerts([]);
      const result = await generatePredictiveAlerts({ trainComponentConditions: conditions });
      try {
        // The AI often returns a markdown block with JSON inside
        const jsonString = result.predictiveAlerts.replace(/```json\n|```/g, '').trim();
        const parsedAlerts = JSON.parse(jsonString);
        setAlerts(parsedAlerts);
      } catch (e) {
        setError("Failed to parse AI response. Please try again.");
        console.error(e);
      }
    });
  };

  const getRiskBadge = (score: number) => {
    if (score > 75) return <Badge variant="destructive" className="gap-1.5"><AlertTriangle className="h-3 w-3" />High</Badge>;
    if (score > 40) return <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/80 gap-1.5"><AlertCircle className="h-3 w-3" />Medium</Badge>;
    return <Badge variant="secondary" className="bg-green-400 text-green-900 hover:bg-green-400/80 gap-1.5"><ShieldCheck className="h-3 w-3" />Low</Badge>;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Maintenance Alerts</CardTitle>
        <CardDescription>
          AI-powered analysis of component conditions to forecast potential failures.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-1">
            Train Component Conditions
          </label>
          <Textarea
            id="conditions"
            placeholder="Enter train component conditions..."
            rows={5}
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="bg-white"
          />
        </div>
        
        {alerts.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Generated Alerts</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Badge variant="destructive" className="p-1"><AlertTriangle className="h-3 w-3" /></Badge> High: Immediate action required</div>
                <div className="flex items-center gap-1.5"><Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/80 p-1"><AlertCircle className="h-3 w-3" /></Badge> Medium: Schedule maintenance soon</div>
                <div className="flex items-center gap-1.5"><Badge variant="secondary" className="bg-green-400 text-green-900 hover:bg-green-400/80 p-1"><ShieldCheck className="h-3 w-3" /></Badge> Low: Monitor component</div>
              </div>
            </div>
            <div className="border rounded-lg">
                {alerts.map((alert, index) => (
                    <div key={index} className={`p-4 space-y-2 ${index < alerts.length - 1 ? 'border-b' : ''}`}>
                        <div className="flex justify-between items-start">
                            <div className="font-semibold text-primary">{alert.affected_component}</div>
                            {getRiskBadge(alert.risk_score)}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.recommended_actions}</p>
                    </div>
                ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Alerts"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
