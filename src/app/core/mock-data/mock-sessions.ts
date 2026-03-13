import { ParkingSession } from '../models';

export const MOCK_PARKING_SESSIONS: ParkingSession[] = [
  { id: 'PS001', vehicleNumber: 'MH-12-AB-1234', vehicleType: 'car', assignedSlot: 'A-02', entryTime: '2026-03-13T07:30:00Z', exitTime: null, duration: null, fee: null, status: 'active' },
  { id: 'PS002', vehicleNumber: 'MH-14-CD-5678', vehicleType: 'suv', assignedSlot: 'A-04', entryTime: '2026-03-13T08:00:00Z', exitTime: null, duration: null, fee: null, status: 'active' },
  { id: 'PS003', vehicleNumber: 'MH-01-EF-9012', vehicleType: 'motorcycle', assignedSlot: 'B-03', entryTime: '2026-03-13T09:00:00Z', exitTime: null, duration: null, fee: null, status: 'active' },
  { id: 'PS004', vehicleNumber: 'MH-43-GH-3456', vehicleType: 'car', assignedSlot: 'C-02', entryTime: '2026-03-13T09:30:00Z', exitTime: null, duration: null, fee: null, status: 'active' },
  { id: 'PS005', vehicleNumber: 'MH-20-IJ-7890', vehicleType: 'truck', assignedSlot: 'D-02', entryTime: '2026-03-13T07:00:00Z', exitTime: null, duration: null, fee: null, status: 'active' },
  { id: 'PS006', vehicleNumber: 'MH-09-KL-2345', vehicleType: 'suv', assignedSlot: 'E-01', entryTime: '2026-03-13T08:30:00Z', exitTime: null, duration: null, fee: null, status: 'active' },

  // Completed sessions (historical)
  { id: 'PS007', vehicleNumber: 'MH-12-MN-6789', vehicleType: 'car', assignedSlot: 'A-01', entryTime: '2026-03-12T08:00:00Z', exitTime: '2026-03-12T12:30:00Z', duration: 270, fee: 135, status: 'completed' },
  { id: 'PS008', vehicleNumber: 'MH-14-OP-0123', vehicleType: 'motorcycle', assignedSlot: 'C-01', entryTime: '2026-03-12T09:15:00Z', exitTime: '2026-03-12T11:45:00Z', duration: 150, fee: 50, status: 'completed' },
  { id: 'PS009', vehicleNumber: 'MH-01-QR-4567', vehicleType: 'suv', assignedSlot: 'B-01', entryTime: '2026-03-12T07:00:00Z', exitTime: '2026-03-12T16:00:00Z', duration: 540, fee: 350, status: 'completed' },
  { id: 'PS010', vehicleNumber: 'MH-43-ST-8901', vehicleType: 'car', assignedSlot: 'A-03', entryTime: '2026-03-12T10:00:00Z', exitTime: '2026-03-12T14:00:00Z', duration: 240, fee: 120, status: 'completed' },
  { id: 'PS011', vehicleNumber: 'MH-20-UV-2345', vehicleType: 'truck', assignedSlot: 'B-02', entryTime: '2026-03-12T06:00:00Z', exitTime: '2026-03-12T18:00:00Z', duration: 720, fee: 500, status: 'completed' },
  { id: 'PS012', vehicleNumber: 'MH-09-WX-6789', vehicleType: 'car', assignedSlot: 'D-01', entryTime: '2026-03-11T10:00:00Z', exitTime: '2026-03-11T15:00:00Z', duration: 300, fee: 150, status: 'completed' },
  { id: 'PS013', vehicleNumber: 'MH-12-YZ-0123', vehicleType: 'motorcycle', assignedSlot: 'C-03', entryTime: '2026-03-11T08:30:00Z', exitTime: '2026-03-11T10:00:00Z', duration: 90, fee: 30, status: 'completed' },
  { id: 'PS014', vehicleNumber: 'MH-14-AB-4567', vehicleType: 'suv', assignedSlot: 'E-02', entryTime: '2026-03-11T11:00:00Z', exitTime: '2026-03-11T17:00:00Z', duration: 360, fee: 230, status: 'completed' },
  { id: 'PS015', vehicleNumber: 'MH-01-CD-8901', vehicleType: 'car', assignedSlot: 'A-04', entryTime: '2026-03-10T09:00:00Z', exitTime: '2026-03-10T13:00:00Z', duration: 240, fee: 120, status: 'completed' },
  { id: 'PS016', vehicleNumber: 'MH-43-EF-2345', vehicleType: 'car', assignedSlot: 'D-03', entryTime: '2026-03-10T07:30:00Z', exitTime: '2026-03-10T12:00:00Z', duration: 270, fee: 135, status: 'completed' },
  { id: 'PS017', vehicleNumber: 'MH-20-GH-6789', vehicleType: 'motorcycle', assignedSlot: 'C-04', entryTime: '2026-03-10T14:00:00Z', exitTime: '2026-03-10T16:30:00Z', duration: 150, fee: 50, status: 'completed' },
  { id: 'PS018', vehicleNumber: 'MH-09-IJ-0123', vehicleType: 'truck', assignedSlot: 'B-04', entryTime: '2026-03-09T06:00:00Z', exitTime: '2026-03-09T20:00:00Z', duration: 840, fee: 580, status: 'completed' },
  { id: 'PS019', vehicleNumber: 'MH-12-KL-4567', vehicleType: 'car', assignedSlot: 'A-01', entryTime: '2026-03-09T08:00:00Z', exitTime: '2026-03-09T11:00:00Z', duration: 180, fee: 90, status: 'completed' },
  { id: 'PS020', vehicleNumber: 'MH-14-MN-8901', vehicleType: 'suv', assignedSlot: 'E-03', entryTime: '2026-03-09T10:00:00Z', exitTime: '2026-03-09T18:00:00Z', duration: 480, fee: 310, status: 'completed' },
  { id: 'PS021', vehicleNumber: 'MH-01-OP-2345', vehicleType: 'car', assignedSlot: 'D-04', entryTime: '2026-03-08T09:00:00Z', exitTime: '2026-03-08T14:30:00Z', duration: 330, fee: 165, status: 'completed' },
  { id: 'PS022', vehicleNumber: 'MH-43-QR-6789', vehicleType: 'motorcycle', assignedSlot: 'C-01', entryTime: '2026-03-08T11:00:00Z', exitTime: '2026-03-08T13:00:00Z', duration: 120, fee: 40, status: 'completed' },
  { id: 'PS023', vehicleNumber: 'MH-20-ST-0123', vehicleType: 'car', assignedSlot: 'A-02', entryTime: '2026-03-07T08:00:00Z', exitTime: '2026-03-07T17:00:00Z', duration: 540, fee: 350, status: 'completed' },
  { id: 'PS024', vehicleNumber: 'MH-09-UV-4567', vehicleType: 'suv', assignedSlot: 'B-01', entryTime: '2026-03-07T07:00:00Z', exitTime: '2026-03-07T12:00:00Z', duration: 300, fee: 195, status: 'completed' },
  { id: 'PS025', vehicleNumber: 'MH-12-WX-8901', vehicleType: 'truck', assignedSlot: 'E-01', entryTime: '2026-03-07T06:00:00Z', exitTime: '2026-03-07T19:00:00Z', duration: 780, fee: 540, status: 'completed' },
];
