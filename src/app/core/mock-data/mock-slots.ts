import { ParkingSlot } from '../models';

export const MOCK_PARKING_SLOTS: ParkingSlot[] = [
  { id: 'S001', slotNumber: 'A-01', slotType: 'compact', isAvailable: true, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-13T06:00:00Z' },
  { id: 'S002', slotNumber: 'A-02', slotType: 'compact', isAvailable: false, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-13T07:30:00Z' },
  { id: 'S003', slotNumber: 'A-03', slotType: 'standard', isAvailable: true, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-13T05:00:00Z' },
  { id: 'S004', slotNumber: 'A-04', slotType: 'standard', isAvailable: false, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-13T08:00:00Z' },
  { id: 'S005', slotNumber: 'B-01', slotType: 'large', isAvailable: true, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-12T15:00:00Z' },
  { id: 'S006', slotNumber: 'B-02', slotType: 'large', isAvailable: true, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-12T18:00:00Z' },
  { id: 'S007', slotNumber: 'B-03', slotType: 'handicapped', isAvailable: false, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-13T09:00:00Z' },
  { id: 'S008', slotNumber: 'B-04', slotType: 'standard', isAvailable: true, createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-03-12T12:00:00Z' },
  { id: 'S009', slotNumber: 'C-01', slotType: 'compact', isAvailable: true, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-03-13T04:00:00Z' },
  { id: 'S010', slotNumber: 'C-02', slotType: 'standard', isAvailable: false, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-03-13T09:30:00Z' },
  { id: 'S011', slotNumber: 'C-03', slotType: 'compact', isAvailable: true, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-03-12T20:00:00Z' },
  { id: 'S012', slotNumber: 'C-04', slotType: 'large', isAvailable: true, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-03-12T10:00:00Z' },
  { id: 'S013', slotNumber: 'D-01', slotType: 'handicapped', isAvailable: true, createdAt: '2026-02-10T08:00:00Z', updatedAt: '2026-03-11T14:00:00Z' },
  { id: 'S014', slotNumber: 'D-02', slotType: 'standard', isAvailable: false, createdAt: '2026-02-10T08:00:00Z', updatedAt: '2026-03-13T07:00:00Z' },
  { id: 'S015', slotNumber: 'D-03', slotType: 'compact', isAvailable: true, createdAt: '2026-02-10T08:00:00Z', updatedAt: '2026-03-12T22:00:00Z' },
  { id: 'S016', slotNumber: 'D-04', slotType: 'standard', isAvailable: true, createdAt: '2026-02-10T08:00:00Z', updatedAt: '2026-03-12T16:00:00Z' },
  { id: 'S017', slotNumber: 'E-01', slotType: 'large', isAvailable: false, createdAt: '2026-02-20T08:00:00Z', updatedAt: '2026-03-13T08:30:00Z' },
  { id: 'S018', slotNumber: 'E-02', slotType: 'compact', isAvailable: true, createdAt: '2026-02-20T08:00:00Z', updatedAt: '2026-03-11T11:00:00Z' },
  { id: 'S019', slotNumber: 'E-03', slotType: 'standard', isAvailable: true, createdAt: '2026-02-20T08:00:00Z', updatedAt: '2026-03-12T09:00:00Z' },
  { id: 'S020', slotNumber: 'E-04', slotType: 'handicapped', isAvailable: true, createdAt: '2026-02-20T08:00:00Z', updatedAt: '2026-03-10T17:00:00Z' },
];
