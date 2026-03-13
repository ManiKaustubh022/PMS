import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, ApiResponse, RecentActivity } from '../models';
import { API_CONFIG } from '../config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(API_CONFIG.baseUrl + '/dashboard/stats');
  }

  getRecentActivity(): Observable<ApiResponse<RecentActivity[]>> {
    return this.http.get<ApiResponse<RecentActivity[]>>(API_CONFIG.baseUrl + '/dashboard/recent-activity');
  }
}
