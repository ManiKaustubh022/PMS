export interface ParkingSession {
  id: string;
  vehicleNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'suv';
  assignedSlot: string;
  entryTime: string;
  exitTime: string | null;
  duration: number | null;
  fee: number | null;
  status: 'active' | 'completed';
}
