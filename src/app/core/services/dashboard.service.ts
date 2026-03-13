import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardStats, ApiResponse } from '../models';
import { MOCK_DASHBOARD_STATS } from '../mock-data/mock-dashboard';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSessionService } from './parking-session.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private slotService: ParkingSlotService,
    private sessionService: ParkingSessionService,
  ) {}

  getStats(): Observable<ApiResponse<DashboardStats>> {
    const slots = this.slotService.getSlotsSync();
    const sessions = this.sessionService.getSessionsSync();

    const totalSlots = slots.length;
    const availableSlots = slots.filter(s => s.isAvailable).length;
    const occupiedSlots = totalSlots - availableSlots;

    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.entryTime.startsWith(today));
    const completedToday = todaySessions.filter(s => s.status === 'completed');
    const revenueToday = completedToday.reduce((sum, s) => sum + (s.fee || 0), 0);

    const stats: DashboardStats = {
      ...MOCK_DASHBOARD_STATS,
      totalSlots,
      availableSlots,
      occupiedSlots,
      vehiclesParkedToday: todaySessions.length > 0 ? todaySessions.length : MOCK_DASHBOARD_STATS.vehiclesParkedToday,
      totalRevenueToday: revenueToday > 0 ? revenueToday : MOCK_DASHBOARD_STATS.totalRevenueToday,
      slotUtilization: { available: availableSlots, occupied: occupiedSlots },
    };

    return of<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
      message: 'Dashboard stats retrieved',
    }).pipe(delay(400));
  }
}
