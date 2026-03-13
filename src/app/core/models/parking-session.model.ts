export interface ParkingSession {
  id: string;
  vehicleNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'suv';
  assignedSlot: string;
  driverName?: string | null;
  phoneNumber?: string | null;
  licenseNumber?: string | null;
  entryTime: string;
  exitTime: string | null;
  duration: number | null;
  expectedDuration?: number | null;
  fee: number | null;
  fine?: number | null;
  status: 'active' | 'completed';
}
