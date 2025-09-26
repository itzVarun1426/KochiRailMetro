"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { brandingService } from "@/lib/services/brandingService";

export default function BrandingPage() {
  const { toast } = useToast();

  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for contract
  const [advertiserName, setAdvertiserName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requiredHours, setRequiredHours] = useState<string>("");
  const [brandingType, setBrandingType] = useState("FULL_WRAP");
  const [brandingDescription, setBrandingDescription] = useState("");
  const [contractValue, setContractValue] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [penaltyTerms, setPenaltyTerms] = useState("");
  const [penaltyPercentage, setPenaltyPercentage] = useState<string>("");
  const [minimumDailyHours, setMinimumDailyHours] = useState<string>("");
  const [minimumWeeklyHours, setMinimumWeeklyHours] = useState<string>("");
  const [slaRequirements, setSlaRequirements] = useState("");
  const [creativeContent, setCreativeContent] = useState("");
  const [placementInstructions, setPlacementInstructions] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contractStatus, setContractStatus] = useState("ACTIVE");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await brandingService.getAllContracts();
        setContracts(data);
      } catch (e:any) {
        toast({ title: 'Failed to load branding contracts', description: e?.message || 'Unknown error', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleCreate = async () => {
    if (!advertiserName || !startDate || !endDate || !brandingType || !contractStatus) {
      toast({ title: 'Missing fields', description: 'Advertiser, dates, type and status are required.', variant: 'destructive' });
      return;
    }
    const nowIso = new Date().toISOString();
    const payload: any = {
      advertiserName,
      startDate,
      endDate,
      requiredHours: requiredHours ? Number(requiredHours) : 0,
      brandingType,
      brandingDescription,
      contractValue: contractValue ? Number(contractValue) : 0,
      hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
      penaltyTerms,
      penaltyPercentage: penaltyPercentage ? Number(penaltyPercentage) : 0,
      minimumDailyHours: minimumDailyHours ? Number(minimumDailyHours) : 0,
      minimumWeeklyHours: minimumWeeklyHours ? Number(minimumWeeklyHours) : 0,
      slaRequirements,
      creativeContent,
      placementInstructions,
      contactPerson,
      contactEmail,
      contactPhone,
      contractStatus,
      lastUpdated: nowIso,
    };
    try {
      await brandingService.createContract(payload);
      toast({ title: 'Branding contract created' });
      const data = await brandingService.getAllContracts();
      setContracts(data);
    } catch (e:any) {
      console.error('Create branding contract failed:', e);
      toast({ title: 'Failed to create contract', description: e?.message || 'Unknown error', variant: 'destructive' });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Branding Contracts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Contract</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="col-span-2">
            <Label>Advertiser</Label>
            <Input value={advertiserName} onChange={e=>setAdvertiserName(e.target.value)} placeholder="Advertiser Name" />
          </div>
          <div className="col-span-1">
            <Label>Type</Label>
            <Select value={brandingType} onValueChange={setBrandingType}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {['FULL_WRAP','PARTIAL_WRAP','SIDE_PANEL','DOOR_WRAP','WINDOW_STICKERS','GRAB_HANDLES','CEILING_POSTERS','FLOOR_STICKERS','SEAT_COVERS','DIGITAL_DISPLAYS','EXTERIOR_PANELS','INTERIOR_POSTERS'].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label>Status</Label>
            <Select value={contractStatus} onValueChange={setContractStatus}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {['ACTIVE','PAUSED','COMPLETED','CANCELLED'].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Required Hours</Label>
            <Input type="number" value={requiredHours} onChange={e=>setRequiredHours(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Contract Value</Label>
            <Input type="number" value={contractValue} onChange={e=>setContractValue(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Hourly Rate</Label>
            <Input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Penalty Terms</Label>
            <Input value={penaltyTerms} onChange={e=>setPenaltyTerms(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Penalty %</Label>
            <Input type="number" value={penaltyPercentage} onChange={e=>setPenaltyPercentage(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Min Daily Hours</Label>
            <Input type="number" value={minimumDailyHours} onChange={e=>setMinimumDailyHours(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Min Weekly Hours</Label>
            <Input type="number" value={minimumWeeklyHours} onChange={e=>setMinimumWeeklyHours(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>SLA Requirements</Label>
            <Input value={slaRequirements} onChange={e=>setSlaRequirements(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Creative Content</Label>
            <Input value={creativeContent} onChange={e=>setCreativeContent(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Placement Instructions</Label>
            <Input value={placementInstructions} onChange={e=>setPlacementInstructions(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Contact Person</Label>
            <Input value={contactPerson} onChange={e=>setContactPerson(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Contact Email</Label>
            <Input type="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Contact Phone</Label>
            <Input value={contactPhone} onChange={e=>setContactPhone(e.target.value)} />
          </div>
          <div className="col-span-4 flex justify-end">
            <Button onClick={handleCreate}>Add Contract</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (Array.isArray(contracts) && contracts[0] !== undefined) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(contracts || []).map((c: any) => (
                <div key={c.contractId || c.advertiserName} className="p-4 border rounded-md">
                  <div className="font-semibold">{c.advertiserName}</div>
                  <div className="text-sm">Type: {c.brandingType}</div>
                  <div className="text-sm">Status: {c.contractStatus}</div>
                  <div className="text-sm">Period: {c.startDate} → {c.endDate}</div>
                  <div className="text-sm">Value: {c.contractValue}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No contracts found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


