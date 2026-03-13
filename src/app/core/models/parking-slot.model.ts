export interface ParkingSlot {
  id: string;
  slotNumber: string;
  slotType: 'compact' | 'standard' | 'large' | 'handicapped';
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
