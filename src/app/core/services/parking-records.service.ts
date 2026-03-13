import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ParkingSession, ApiResponse, PaginationMeta } from '../models';
import { ParkingSessionService } from './parking-session.service';

@Injectable({ providedIn: 'root' })
export class ParkingRecordsService {

  constructor(private sessionService: ParkingSessionService) {}

  getRecords(params: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    slot?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Observable<ApiResponse<ParkingSession[]>> {
    // Get completed sessions synchronously from the session service's in-memory store
    const allSessions = this.sessionService.getSessionsSync();
    let records = allSessions.filter(s => s.status === 'completed').map(s => ({ ...s }));

    // Search by vehicle number
    if (params.search) {
      const q = params.search.toLowerCase();
      records = records.filter(r => r.vehicleNumber.toLowerCase().includes(q));
    }

    // Filter by date range
    if (params.dateFrom) {
      const from = new Date(params.dateFrom).getTime();
      records = records.filter(r => new Date(r.entryTime).getTime() >= from);
    }
    if (params.dateTo) {
      const to = new Date(params.dateTo).getTime() + 86400000;
      records = records.filter(r => new Date(r.entryTime).getTime() <= to);
    }

    // Filter by slot
    if (params.slot) {
      records = records.filter(r => r.assignedSlot === params.slot);
    }

    // Sorting
    const sortBy = params.sortBy || 'entryTime';
    const sortOrder = params.sortOrder || 'desc';
    records.sort((a, b) => {
      let valA: any = (a as any)[sortBy];
      let valB: any = (b as any)[sortBy];
      if (sortBy === 'entryTime' || sortBy === 'exitTime') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedRecords = records.slice(start, start + pageSize);

    const meta: PaginationMeta = { currentPage: page, pageSize, totalItems, totalPages };

    return of<ApiResponse<ParkingSession[]>>({
      success: true,
      data: paginatedRecords,
      message: 'Records retrieved successfully',
      meta,
    }).pipe(delay(350));
  }
}
