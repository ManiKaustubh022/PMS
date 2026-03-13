import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParkingSession, ApiResponse } from '../models';
import { API_CONFIG } from '../config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class ParkingSessionService {
  private http = inject(HttpClient);

  getAll(): Observable<ApiResponse<ParkingSession[]>> {
    return this.http.get<ApiResponse<ParkingSession[]>>(API_CONFIG.baseUrl + '/parking-sessions');
  }

  getActiveSessions(): Observable<ApiResponse<ParkingSession[]>> {
    // Backend doesn't have a specific active endpoint yet, we fetch all and filter 
    // or we can add query params. Let's filter locally for now to minimize changes.
    return new Observable<ApiResponse<ParkingSession[]>>(observer => {
      this.getAll().subscribe({
        next: (res) => {
          if (res.success) {
            observer.next({
              ...res,
              data: res.data.filter(s => s.status === 'active')
            });
          } else {
            observer.next(res);
          }
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  createEntry(entry: {
    vehicleNumber: string;
    vehicleType: ParkingSession['vehicleType'];
    assignedSlot: string;
    driverName?: string;
    phoneNumber?: string;
    licenseNumber?: string;
    expectedDuration?: number;
  }): Observable<ApiResponse<ParkingSession>> {
    return this.http.post<ApiResponse<ParkingSession>>(API_CONFIG.baseUrl + '/parking-sessions', entry);
  }

  completeExit(sessionId: string): Observable<ApiResponse<ParkingSession | null>> {
    return this.http.put<ApiResponse<ParkingSession | null>>(`${API_CONFIG.baseUrl}/parking-sessions/${sessionId}/complete`, {});
  }

  getCompletedSessions(): Observable<ApiResponse<ParkingSession[]>> {
    return new Observable<ApiResponse<ParkingSession[]>>(observer => {
      this.getAll().subscribe({
        next: (res) => {
          if (res.success) {
            observer.next({
              ...res,
              data: res.data.filter(s => s.status === 'completed')
            });
          } else {
            observer.next(res);
          }
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
