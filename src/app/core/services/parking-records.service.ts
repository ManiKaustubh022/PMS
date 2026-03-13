import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParkingSession, ApiResponse } from '../models';
import { API_CONFIG } from '../config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class ParkingRecordsService {
  private http = inject(HttpClient);

  getRecords(paramsConfig: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    slot?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Observable<ApiResponse<ParkingSession[]>> {
    let params = new HttpParams();
    
    if (paramsConfig.search) params = params.set('search', paramsConfig.search);
    if (paramsConfig.dateFrom) params = params.set('dateFrom', paramsConfig.dateFrom);
    if (paramsConfig.dateTo) params = params.set('dateTo', paramsConfig.dateTo);
    if (paramsConfig.slot) params = params.set('slot', paramsConfig.slot);
    if (paramsConfig.page) params = params.set('page', paramsConfig.page.toString());
    if (paramsConfig.pageSize) params = params.set('pageSize', paramsConfig.pageSize.toString());
    if (paramsConfig.sortBy) params = params.set('sortBy', paramsConfig.sortBy);
    if (paramsConfig.sortOrder) params = params.set('sortOrder', paramsConfig.sortOrder);

    return this.http.get<ApiResponse<ParkingSession[]>>(API_CONFIG.baseUrl + '/parking-records', { params });
  }
}
