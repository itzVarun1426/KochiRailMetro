import { trainService } from './trainService';
import { jobCardService } from './jobCardService';
import { certificateService } from './certificateService';
import type { Kpi } from '../types';

export const dashboardService = {
  // Get dashboard KPIs
  getKPIs: async (): Promise<Kpi[]> => {
    // Fetch data from various services
    const [trainsRaw, openJobCardsRaw, expiredCertificatesRaw] = await Promise.all([
      trainService.getAllTrains(),
      jobCardService.getOpenJobCards(),
      certificateService.getExpiredCertificates()
    ]);

    // Normalize potentially undefined/null responses to arrays
    const trains = Array.isArray(trainsRaw) ? trainsRaw : [];
    const openJobCards = Array.isArray(openJobCardsRaw) ? openJobCardsRaw : [];
    const expiredCertificates = Array.isArray(expiredCertificatesRaw) ? expiredCertificatesRaw : [];

    // Calculate KPIs based on real data (with safe defaults)
    const totalTrains = trains.length;
    const operationalTrains = trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'ACTIVE').length;
    const maintenanceTrains = trains.filter(t => t.status === 'MAINTENANCE').length;
    const retiredTrains = trains.filter(t => t.status === 'RETIRED').length;
    
    const pendingClearance = expiredCertificates.length;
    const predictedFailures = openJobCards.filter(jc => jc.priority === 'High').length;

    return [
      {
        title: 'Total Trainsets',
        value: totalTrains.toString(),
        change: '',
        changeType: 'increase',
        description: 'Total operational fleet size',
        filterValue: 'all',
      },
      {
        title: 'Ready for Service',
        value: operationalTrains.toString(),
        change: '+1',
        changeType: 'increase',
        description: 'Available for immediate deployment',
        filterValue: 'IN_SERVICE',
      },
      {
        title: 'Retired',
        value: retiredTrains.toString(),
        change: '',
        changeType: 'increase',
        description: 'Retired from service',
        filterValue: 'RETIRED',
      },
      {
        title: 'In Maintenance',
        value: maintenanceTrains.toString(),
        change: '',
        changeType: 'increase',
        description: 'Currently undergoing maintenance',
        filterValue: 'MAINTENANCE',
      },
      {
        title: 'Pending Clearance',
        value: totalTrains === 0 ? '0%' : `${Math.round((pendingClearance / totalTrains) * 100)}%`,
        change: '+2%',
        changeType: 'increase',
        description: 'Awaiting certificate clearance',
      },
      {
        title: 'Predicted Failures',
        value: predictedFailures.toString(),
        change: '+1',
        changeType: 'increase',
        description: 'In next 24 hours',
      },
    ];
  },
};
