export type Kpi = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
  filterValue?: string;
};

export type JobCard = {
  id: string;
  trainId: string;
  task: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
  assignedTo: string;
  createdDate: string;
  priority: 'High' | 'Medium' | 'Low';
  expectedCompletion: string;
  supervisor: string;
  attachments: string[];
};

// Backend job card entity shape (as stored/returned by API)
export type BackendJobCard = {
  jobCardId: string;
  trainId: number;
  trainsetId: number | null;
  assetComponent: string; // e.g. 'GENERAL'
  workType: 'CORRECTIVE' | 'PREVENTIVE' | string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CLOSED' | string;
  reportedDate: string; // ISO
  targetCompletionDate: string; // ISO
  actualStart: string | null;
  actualEnd: string | null;
  summary: string;
  details: string;
  laborHoursLogged: number;
  assignedTo: string;
  supervisorOverride: boolean;
  lastUpdated: string;
};

export type BrandingDetails = {
  status: 'Yes' | 'No';

  // Contract Info
  contractId?: string;
  startDate?: string;
  endDate?: string;
  contractValue?: number;
  hourlyRate?: number;
  contractStatus?: 'Active' | 'Expired' | 'Pending';
  lastUpdated?: string;

  // Branding Info
  advertiserName?: string;
  brandingType?: 'Full Wrap' | 'Partial Wrap' | 'Interior';
  brandingDescription?: string;
  creativeContent?: string; // URL or description
  placementInstructions?: string;

  // Performance & SLA
  requiredHours?: number;
  minimumDailyHours?: number;
  minimumWeeklyHours?: number;
  slaRequirements?: string;

  // Penalty & Compliance
  penaltyTerms?: string;
  penaltyPercentage?: number;

  // Contact Info
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
};

export type CleaningDetails = {
  // Bay & Task Info
  bayId: string;
  cleaningType: 'DEEP_CLEAN' | 'ROUTINE' | 'QUICK_WASH';
  remarks?: string;

  // Schedule & Execution
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;

  // Progress Tracking
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
  lastUpdated: string;
  
  // For backwards compatibility with older components
  lastCleaned: string;

  // Team & Authorization
  assignedTeamId: string;
  supervisorOverride: boolean;
};

export type CertificateDetails = {
  // Certificate Details
  certificateId: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  isRenewal: boolean;
  previousCertificateId?: string;
  
  // Department & Authority
  department: 'ROLLING_STOCK' | 'SIGNALING' | 'OPERATIONS';
  issuedBy: string;
  approvedBy: string;
  
  // Inspection & Compliance
  lastInspectionDate: string;
  nextInspectionDue: string;
  inspectionDetails?: string;
  complianceNotes?: string;
  
  // Additional Info
  remarks?: string;
  lastUpdated: string;
};

export type Train = {
  // Identification
  trainId: number;
  trainNumber: string;
  commissioningDate: string;
  
  // Operational Details
  status: 'IN_SERVICE' | 'MAINTENANCE' | 'ACTIVE' | 'RETIRED';
  depotLocation: string;
  lastUpdated: string;
  
  // Mileage & Maintenance
  currentOdometer: number;
  lastMaintenanceDate: string;
  odometerAtLastMaintenance: number;
  maintenanceInterval: number;
  
  // Cleaning
  lastCleaningDateTime: string;
  cleaningPeriod: number;
  dailyMaxMileage: number;
  
  // Related Data (arrays from API)
  jobCards: any[];
  fitnessCertificates: any[];
  brandingAssignments: any[];
  cleaningTasks: any[];
  tripHistories: any[];
};

export type Track = {
  id: string;
  type: 'Stabling' | 'Washing' | 'Maintenance' | 'Mainline';
  length: number; // in meters
  trains: string[];
};

export type DepotLayout = {
  tracks: Track[];
};
