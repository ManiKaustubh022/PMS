export interface DashboardStats {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  vehiclesParkedToday: number;
  totalRevenueToday: number;
  weeklyRevenue: number[];
  weeklyLabels: string[];
  slotUtilization: { available: number; occupied: number };
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  vehicleNumber: string;
  action: 'entry' | 'exit';
  slotNumber: string;
  timestamp: string;
  fee?: number;
}
