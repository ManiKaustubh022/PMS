import { DashboardStats } from '../models';

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalSlots: 20,
  availableSlots: 14,
  occupiedSlots: 6,
  vehiclesParkedToday: 18,
  totalRevenueToday: 2840,
  weeklyRevenue: [1250, 1890, 2100, 1650, 2340, 2840, 1920],
  weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  slotUtilization: { available: 14, occupied: 6 },
  recentActivity: [
    { id: 'RA001', vehicleNumber: 'MH-09-KL-2345', action: 'entry', slotNumber: 'E-01', timestamp: '2026-03-13T08:30:00Z' },
    { id: 'RA002', vehicleNumber: 'MH-43-GH-3456', action: 'entry', slotNumber: 'C-02', timestamp: '2026-03-13T09:30:00Z' },
    { id: 'RA003', vehicleNumber: 'MH-01-EF-9012', action: 'entry', slotNumber: 'B-03', timestamp: '2026-03-13T09:00:00Z' },
    { id: 'RA004', vehicleNumber: 'MH-12-MN-6789', action: 'exit', slotNumber: 'A-01', timestamp: '2026-03-12T12:30:00Z', fee: 135 },
    { id: 'RA005', vehicleNumber: 'MH-14-OP-0123', action: 'exit', slotNumber: 'C-01', timestamp: '2026-03-12T11:45:00Z', fee: 50 },
    { id: 'RA006', vehicleNumber: 'MH-01-QR-4567', action: 'exit', slotNumber: 'B-01', timestamp: '2026-03-12T16:00:00Z', fee: 350 },
    { id: 'RA007', vehicleNumber: 'MH-14-CD-5678', action: 'entry', slotNumber: 'A-04', timestamp: '2026-03-13T08:00:00Z' },
    { id: 'RA008', vehicleNumber: 'MH-12-AB-1234', action: 'entry', slotNumber: 'A-02', timestamp: '2026-03-13T07:30:00Z' },
  ],
};
