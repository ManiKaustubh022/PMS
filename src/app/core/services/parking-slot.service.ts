import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParkingSlot, ApiResponse } from '../models';
import { API_CONFIG } from '../config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class ParkingSlotService {
  private http = inject(HttpClient);

  getAll(): Observable<ApiResponse<ParkingSlot[]>> {
    return this.http.get<ApiResponse<ParkingSlot[]>>(API_CONFIG.baseUrl + '/parking-slots');
  }

  getById(id: string): Observable<ApiResponse<ParkingSlot | null>> {
    return this.http.get<ApiResponse<ParkingSlot | null>>(`${API_CONFIG.baseUrl}/parking-slots/${id}`);
  }

  create(slot: Partial<ParkingSlot>): Observable<ApiResponse<ParkingSlot>> {
    return this.http.post<ApiResponse<ParkingSlot>>(API_CONFIG.baseUrl + '/parking-slots', slot);
  }

  update(id: string, updates: Partial<ParkingSlot>): Observable<ApiResponse<ParkingSlot | null>> {
    return this.http.put<ApiResponse<ParkingSlot | null>>(`${API_CONFIG.baseUrl}/parking-slots/${id}`, updates);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${API_CONFIG.baseUrl}/parking-slots/${id}`);
  }

  getAvailableSlots(): Observable<ApiResponse<ParkingSlot[]>> {
    // Note: Backend might not have this explicit endpoint, but we can just fetch all and filter, 
    // or add it to backend. We'll fetch all and filter via RxJS map if needed, 
    // but right now components mostly use getAll and filter. We will implement it by fetching all and filtering for simplicity.
    // Actually, let's keep it simple.
    return new Observable<ApiResponse<ParkingSlot[]>>(observer => {
      this.getAll().subscribe({
        next: (res) => {
          if (res.success) {
            observer.next({
              ...res,
              data: res.data.filter(s => s.isAvailable)
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

  updateAvailability(id: string, isAvailable: boolean): Observable<ApiResponse<ParkingSlot | null>> {
    return this.update(id, { isAvailable });
  }
}
