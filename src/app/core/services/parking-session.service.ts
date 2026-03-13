import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ParkingSession, ApiResponse } from '../models';
import { MOCK_PARKING_SESSIONS } from '../mock-data/mock-sessions';
import { ParkingSlotService } from './parking-slot.service';

@Injectable({ providedIn: 'root' })
export class ParkingSessionService {
  private sessions: ParkingSession[] = JSON.parse(JSON.stringify(MOCK_PARKING_SESSIONS));

  private feeRates: Record<string, number> = {
    car: 0.50,
    motorcycle: 0.33,
    suv: 0.65,
    truck: 0.70,
  };

  constructor(private slotService: ParkingSlotService) {}

  getAll(): Observable<ApiResponse<ParkingSession[]>> {
    return of<ApiResponse<ParkingSession[]>>({
      success: true,
      data: this.sessions.map(s => ({ ...s })),
      message: 'Sessions retrieved successfully',
    }).pipe(delay(300));
  }

  getActiveSessions(): Observable<ApiResponse<ParkingSession[]>> {
    const active = this.sessions.filter(s => s.status === 'active');
    return of<ApiResponse<ParkingSession[]>>({
      success: true,
      data: active.map(s => ({ ...s })),
      message: 'Active sessions retrieved',
    }).pipe(delay(250));
  }

  createEntry(entry: { vehicleNumber: string; vehicleType: ParkingSession['vehicleType']; assignedSlot: string }): Observable<ApiResponse<ParkingSession>> {
    const newSession: ParkingSession = {
      id: 'PS' + String(this.sessions.length + 1).padStart(3, '0'),
      vehicleNumber: entry.vehicleNumber.toUpperCase(),
      vehicleType: entry.vehicleType,
      assignedSlot: entry.assignedSlot,
      entryTime: new Date().toISOString(),
      exitTime: null,
      duration: null,
      fee: null,
      status: 'active',
    };
    this.sessions.unshift(newSession);

    // Mark slot as occupied synchronously
    const slots = this.slotService.getSlotsSync();
    const slot = slots.find(s => s.slotNumber === entry.assignedSlot);
    if (slot) {
      this.slotService.updateAvailability(slot.id, false).subscribe();
    }

    return of<ApiResponse<ParkingSession>>({
      success: true,
      data: { ...newSession },
      message: 'Vehicle entry registered successfully',
    }).pipe(delay(400));
  }

  completeExit(sessionId: string): Observable<ApiResponse<ParkingSession | null>> {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index === -1) {
      return of<ApiResponse<ParkingSession | null>>({ success: false, data: null, message: 'Session not found' }).pipe(delay(200));
    }

    const session = this.sessions[index];
    const exitTime = new Date();
    const entryTime = new Date(session.entryTime);
    const durationMinutes = Math.max(1, Math.round((exitTime.getTime() - entryTime.getTime()) / 60000));
    const rate = this.feeRates[session.vehicleType] || 0.50;
    const fee = Math.round(durationMinutes * rate * 100) / 100;

    this.sessions[index] = {
      ...session,
      exitTime: exitTime.toISOString(),
      duration: durationMinutes,
      fee: fee,
      status: 'completed',
    };

    // Free the slot synchronously
    const slots = this.slotService.getSlotsSync();
    const slot = slots.find(s => s.slotNumber === session.assignedSlot);
    if (slot) {
      this.slotService.updateAvailability(slot.id, true).subscribe();
    }

    return of<ApiResponse<ParkingSession | null>>({
      success: true,
      data: { ...this.sessions[index] },
      message: 'Vehicle exit completed. Fee: ₹' + fee,
    }).pipe(delay(500));
  }

  getCompletedSessions(): Observable<ApiResponse<ParkingSession[]>> {
    const completed = this.sessions.filter(s => s.status === 'completed');
    return of<ApiResponse<ParkingSession[]>>({
      success: true,
      data: completed.map(s => ({ ...s })),
      message: 'Completed sessions retrieved',
    }).pipe(delay(300));
  }

  /** Direct array access for dashboard service */
  getSessionsSync(): ParkingSession[] {
    return this.sessions;
  }
}
