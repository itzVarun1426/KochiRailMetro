"use client";

import { useState, useTransition } from "react";
import { predictCertificateClearance } from "@/ai/flows/predict-certificate-clearance";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type ClearanceOutput = {
  probability: number;
  reasoning: string;
};

export function CertificateClearance() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    weatherCondition: "Rainy",
    trainModel: "Alstom Metropolis",
    maintenanceHistory: "Regular 30-day check completed last week. No major issues reported.",
    lastInspectionDate: new Date().toISOString().split('T')[0],
  });
  const [result, setResult] = useState<ClearanceOutput | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, weatherCondition: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await predictCertificateClearance(formData);
      setResult(res);
    });
  };

  const probabilityPercent = result ? Math.round(result.probability * 100) : 0;
  
  const getProgressColor = (value: number) => {
    if (value > 75) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Certificate Clearance Predictor</CardTitle>
          <CardDescription>
            Analyze conditions to predict certificate clearance probability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainModel">Train Model</Label>
              <Input
                id="trainModel"
                name="trainModel"
                value={formData.trainModel}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weatherCondition">Weather Condition</Label>
              <Select name="weatherCondition" onValueChange={handleSelectChange} value={formData.weatherCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sunny">Sunny</SelectItem>
                  <SelectItem value="Rainy">Rainy</SelectItem>
                  <SelectItem value="Cloudy">Cloudy</SelectItem>
                  <SelectItem value="Stormy">Stormy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
            <Input
              id="lastInspectionDate"
              name="lastInspectionDate"
              type="date"
              value={formData.lastInspectionDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maintenanceHistory">Maintenance History</Label>
            <Input
              id="maintenanceHistory"
              name="maintenanceHistory"
              value={formData.maintenanceHistory}
              onChange={handleChange}
              placeholder="e.g., Regular checks done, brake pads replaced..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Predict Probability
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Prediction Result</CardTitle>
          <CardDescription>
            AI-generated probability of receiving certificate clearance.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {isPending ? (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : result ? (
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-6xl font-bold text-primary">{probabilityPercent}%</p>
                    <p className="text-lg font-medium text-muted-foreground">Clearance Probability</p>
                </div>
                <Progress value={probabilityPercent} className="h-4 [&>div]:" style={{ '--tw-bg-opacity': '1', backgroundColor: getProgressColor(probabilityPercent) }}/>
                <div>
                    <h3 className="font-semibold">Reasoning</h3>
                    <p className="text-sm text-muted-foreground mt-1">{result.reasoning}</p>
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg p-4">
                <Sparkles className="h-10 w-10 mb-2"/>
                <p className="font-semibold">Prediction will appear here</p>
                <p className="text-sm">Enter conditions and run the prediction.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
