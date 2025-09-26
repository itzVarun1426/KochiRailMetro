"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { certificateService } from "@/lib/services/certificateService";
import { trainService } from "@/lib/services/trainService";
import type { CertificateDetails, Train } from "@/lib/types";

export default function CertificatesPage() {
  const { toast } = useToast();

  const [trains, setTrains] = useState<Train[]>([]);
  const [certs, setCerts] = useState<CertificateDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [trainId, setTrainId] = useState<string>("");
  const [department, setDepartment] = useState<string>("ROLLING_STOCK");
  const [issueDate, setIssueDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [status, setStatus] = useState<string>("VALID");
  const [issuedBy, setIssuedBy] = useState<string>("");
  const [certificateNumber, setCertificateNumber] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [inspectionDetails, setInspectionDetails] = useState<string>("");
  const [approvedBy, setApprovedBy] = useState<string>("");
  const [lastInspectionDate, setLastInspectionDate] = useState<string>("");
  const [nextInspectionDue, setNextInspectionDue] = useState<string>("");
  const [complianceNotes, setComplianceNotes] = useState<string>("");
  const [isRenewal, setIsRenewal] = useState<boolean>(false);
  const [previousCertificateId, setPreviousCertificateId] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [t, exp] = await Promise.all([
          trainService.getAllTrains(),
          certificateService.getExpiringSoonCertificates(),
        ]);
        setTrains(t);
        setCerts(exp);
      } catch (e:any) {
        toast({ title: 'Failed to load certificates', description: e?.message || 'Unknown error', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleCreate = async () => {
    if (!trainId || !issueDate || !expiryDate || !status || !certificateNumber) {
      toast({ title: 'Missing fields', description: 'Train, dates, status, and certificate number are required.', variant: 'destructive' });
      return;
    }
    const payload: any = {
      trainId: Number(trainId),
      department,
      issueDate,
      expiryDate,
      status,
      issuedBy,
      certificateNumber,
      remarks,
      inspectionDetails,
      approvedBy: approvedBy || null,
      lastInspectionDate: lastInspectionDate || null,
      nextInspectionDue: nextInspectionDue || null,
      complianceNotes,
      isRenewal,
      previousCertificateId: previousCertificateId || null,
      lastUpdated: new Date().toISOString(),
    };
    try {
      await certificateService.createCertificateEntity(payload);
      toast({ title: 'Certificate created' });
      // refresh expiring soon list
      const exp = await certificateService.getExpiringSoonCertificates();
      setCerts(exp);
    } catch (e:any) {
      console.error('Create certificate failed:', e);
      toast({ title: 'Failed to create certificate', description: e?.message || 'Unknown error', variant: 'destructive' });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fitness Certificates</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Certificate</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="col-span-1">
            <Label htmlFor="train">Train</Label>
            <Select value={trainId} onValueChange={setTrainId}>
              <SelectTrigger id="train"><SelectValue placeholder="Select a train" /></SelectTrigger>
              <SelectContent>
                {(trains || []).map(t => (
                  <SelectItem key={t.trainId} value={String(t.trainId)}>{t.trainNumber || t.trainId}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ROLLING_STOCK">ROLLING_STOCK</SelectItem>
                <SelectItem value="SIGNALLING">SIGNALLING</SelectItem>
                <SelectItem value="TELECOM">TELECOM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="VALID">VALID</SelectItem>
                <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="REVOKED">REVOKED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label>Issued By</Label>
            <Input value={issuedBy} onChange={e=>setIssuedBy(e.target.value)} placeholder="Chief ..." />
          </div>
          <div className="col-span-1">
            <Label>Certificate Number</Label>
            <Input value={certificateNumber} onChange={e=>setCertificateNumber(e.target.value)} placeholder="KMRL-..." />
          </div>
          <div className="col-span-1">
            <Label>Issue Date</Label>
            <Input type="date" value={issueDate} onChange={e=>setIssueDate(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Expiry Date</Label>
            <Input type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Remarks</Label>
            <Input value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Remarks" />
          </div>
          <div className="col-span-2">
            <Label>Inspection Details</Label>
            <Input value={inspectionDetails} onChange={e=>setInspectionDetails(e.target.value)} placeholder="Inspection details" />
          </div>
          <div className="col-span-2">
            <Label>Approved By</Label>
            <Input value={approvedBy} onChange={e=>setApprovedBy(e.target.value)} placeholder="Approver" />
          </div>
          <div className="col-span-1">
            <Label>Last Inspection Date</Label>
            <Input type="date" value={lastInspectionDate} onChange={e=>setLastInspectionDate(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Next Inspection Due</Label>
            <Input type="date" value={nextInspectionDue} onChange={e=>setNextInspectionDue(e.target.value)} />
          </div>
          <div className="col-span-1">
            <Label>Is Renewal</Label>
            <Select value={isRenewal ? 'yes' : 'no'} onValueChange={(v)=> setIsRenewal(v==='yes')}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label>Previous Certificate ID</Label>
            <Input value={previousCertificateId} onChange={e=>setPreviousCertificateId(e.target.value)} placeholder="KMRL-..." />
          </div>
          <div className="col-span-4 flex justify-end">
            <Button onClick={handleCreate}>Add Certificate</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expiring This Week</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (Array.isArray(certs) && certs[0] !== undefined) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(certs || []).map((c) => (
                <div key={`${c.certificateId}-${c.certificateNumber}`} className="p-4 border rounded-md">
                  <div className="font-semibold">{c.certificateNumber}</div>
                  <div className="text-sm">Dept: {c.department}</div>
                  <div className="text-sm">Status: {c.status}</div>
                  <div className="text-sm">Expiry: {c.expiryDate}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No certificates expiring this week.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


