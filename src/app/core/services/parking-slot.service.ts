import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ParkingSlot, ApiResponse } from '../models';
import { MOCK_PARKING_SLOTS } from '../mock-data/mock-slots';

@Injectable({ providedIn: 'root' })
export class ParkingSlotService {
  private slots: ParkingSlot[] = JSON.parse(JSON.stringify(MOCK_PARKING_SLOTS));

  getAll(): Observable<ApiResponse<ParkingSlot[]>> {
    return of<ApiResponse<ParkingSlot[]>>({
      success: true,
      data: this.slots.map(s => ({ ...s })),
      message: 'Parking slots retrieved successfully',
    }).pipe(delay(300));
  }

  getById(id: string): Observable<ApiResponse<ParkingSlot | null>> {
    const slot = this.slots.find(s => s.id === id) || null;
    return of<ApiResponse<ParkingSlot | null>>({
      success: !!slot,
      data: slot ? { ...slot } : null,
      message: slot ? 'Slot found' : 'Slot not found',
    }).pipe(delay(200));
  }

  create(slot: Partial<ParkingSlot>): Observable<ApiResponse<ParkingSlot>> {
    const newSlot: ParkingSlot = {
      id: 'S' + String(this.slots.length + 1).padStart(3, '0'),
      slotNumber: slot.slotNumber || '',
      slotType: slot.slotType || 'standard',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.slots.push(newSlot);
    return of<ApiResponse<ParkingSlot>>({
      success: true,
      data: { ...newSlot },
      message: 'Parking slot created successfully',
    }).pipe(delay(400));
  }

  update(id: string, updates: Partial<ParkingSlot>): Observable<ApiResponse<ParkingSlot | null>> {
    const index = this.slots.findIndex(s => s.id === id);
    if (index === -1) {
      return of<ApiResponse<ParkingSlot | null>>({ success: false, data: null, message: 'Slot not found' }).pipe(delay(200));
    }
    this.slots[index] = { ...this.slots[index], ...updates, updatedAt: new Date().toISOString() };
    return of<ApiResponse<ParkingSlot | null>>({
      success: true,
      data: { ...this.slots[index] },
      message: 'Parking slot updated successfully',
    }).pipe(delay(400));
  }

  delete(id: string): Observable<ApiResponse<null>> {
    const index = this.slots.findIndex(s => s.id === id);
    if (index === -1) {
      return of<ApiResponse<null>>({ success: false, data: null, message: 'Slot not found' }).pipe(delay(200));
    }
    this.slots.splice(index, 1);
    return of<ApiResponse<null>>({
      success: true,
      data: null,
      message: 'Parking slot deleted successfully',
    }).pipe(delay(300));
  }

  getAvailableSlots(): Observable<ApiResponse<ParkingSlot[]>> {
    const available = this.slots.filter(s => s.isAvailable);
    return of<ApiResponse<ParkingSlot[]>>({
      success: true,
      data: available.map(s => ({ ...s })),
      message: 'Available slots retrieved',
    }).pipe(delay(200));
  }

  updateAvailability(id: string, isAvailable: boolean): Observable<ApiResponse<ParkingSlot | null>> {
    return this.update(id, { isAvailable });
  }

  /** Direct access to slots array for other services */
  getSlotsSync(): ParkingSlot[] {
    return this.slots;
  }
}
