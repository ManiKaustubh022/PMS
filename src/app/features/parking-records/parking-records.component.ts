import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkingRecordsService } from '../../core/services/parking-records.service';
import { ParkingSlotService } from '../../core/services/parking-slot.service';
import { ReceiptService } from '../../core/services/receipt.service';
import { ParkingSession, ParkingSlot, PaginationMeta } from '../../core/models';

@Component({
  selector: 'app-parking-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="records-page">
      <div class="page-header">
        <div>
          <h2 class="section-title">Parking Records</h2>
          <p class="section-subtitle">View and search historical parking data</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Search by vehicle number..." class="search-input" id="record-search-input" />
        </div>
        <div class="filter-group">
          <label>From</label>
          <input type="date" [(ngModel)]="dateFrom" (ngModelChange)="onFilterChange()" class="filter-input" />
        </div>
        <div class="filter-group">
          <label>To</label>
          <input type="date" [(ngModel)]="dateTo" (ngModelChange)="onFilterChange()" class="filter-input" />
        </div>
        <div class="filter-group">
          <label>Slot</label>
          <select [(ngModel)]="slotFilter" (ngModelChange)="onFilterChange()" class="filter-input">
            <option value="">All Slots</option>
            <option *ngFor="let s of allSlots" [value]="s.slotNumber">{{ s.slotNumber }}</option>
          </select>
        </div>
        <button class="btn btn-secondary" (click)="resetFilters()">Reset</button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
      </div>

      <!-- Table -->
      <div *ngIf="!loading" class="table-card">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Vehicle Number</th>
                <th>Driver Name</th>
                <th>Type</th>
                <th>Slot</th>
                <th class="sortable" (click)="sort('entryTime')">
                  Entry Time
                  <span class="sort-indicator" *ngIf="sortBy === 'entryTime'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="sortable" (click)="sort('exitTime')">
                  Exit Time
                  <span class="sort-indicator" *ngIf="sortBy === 'exitTime'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="sortable" (click)="sort('duration')">
                  Duration
                  <span class="sort-indicator" *ngIf="sortBy === 'duration'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th>Fee</th>
                <th>Fine</th>
                <th>Total</th>
                <th class="right-align">Receipt</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let record of records" class="table-row">
                <td class="vehicle-num">{{ record.vehicleNumber }}</td>
                <td class="driver-name" [title]="record.phoneNumber || ''">{{ record.driverName || 'N/A' }}</td>
                <td>
                  <span class="type-badge" [attr.data-type]="record.vehicleType">{{ record.vehicleType | titlecase }}</span>
                </td>
                <td>{{ record.assignedSlot }}</td>
                <td class="date-cell">{{ record.entryTime | date:'short' }}</td>
                <td class="date-cell">{{ record.exitTime ? (record.exitTime | date:'short') : '—' }}</td>
                <td>
                  <div class="duration-stack">
                    <span>{{ formatDuration(record.duration) }}</span>
                    <span class="expected-text" *ngIf="record.expectedDuration">Exp: {{ formatDuration(record.expectedDuration) }}</span>
                  </div>
                </td>
                <td class="fee-cell">{{ record.fee !== null ? '₹' + (record.fee | number:'1.2-2') : '—' }}</td>
                <td class="fine-cell">{{ (record.fine !== null && record.fine !== undefined) ? '₹' + (record.fine | number:'1.2-2') : '—' }}</td>
                <td class="total-cell">{{ record.fee !== null ? '₹' + ((record.fee + (record.fine || 0)) | number:'1.2-2') : '—' }}</td>
                <td class="right-align">
                  <button class="btn-action" title="Download PDF Receipt" (click)="downloadReceipt(record)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div *ngIf="records.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="empty-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
          <p>No records found</p>
          <span>Try adjusting your search or filters</span>
        </div>

        <!-- Pagination -->
        <div *ngIf="meta && meta.totalPages > 1" class="pagination">
          <div class="page-info">
            Showing {{ ((meta.currentPage - 1) * meta.pageSize) + 1 }}–{{ Math.min(meta.currentPage * meta.pageSize, meta.totalItems) }} of {{ meta.totalItems }} records
          </div>
          <div class="page-buttons">
            <button class="page-btn" [disabled]="meta.currentPage <= 1" (click)="goToPage(meta.currentPage - 1)">← Prev</button>
            <button *ngFor="let p of getPages()" class="page-btn" [class.active]="p === meta.currentPage" (click)="goToPage(p)">{{ p }}</button>
            <button class="page-btn" [disabled]="meta.currentPage >= meta.totalPages" (click)="goToPage(meta.currentPage + 1)">Next →</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .records-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .page-header { margin-bottom: 20px; }
    .section-title { font-size: 22px; font-weight: 700; color: #EFE5D0; margin: 0; }
    .section-subtitle { font-size: 14px; color: #6d8399; margin: 4px 0 0; }

    .filters-bar {
      display: flex; align-items: flex-end; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
    }
    .search-box { position: relative; flex: 1; min-width: 220px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #6d8399; }
    .search-input {
      width: 100%; padding: 10px 14px 10px 36px; border: 1px solid rgba(125, 192, 181, 0.15);
      border-radius: 10px; background: rgba(37, 61, 82, 0.6); color: #EFE5D0;
      font-size: 14px; outline: none; transition: all 0.2s ease; box-sizing: border-box;
    }
    .search-input:focus { border-color: rgba(125, 192, 181, 0.4); box-shadow: 0 0 0 3px rgba(125, 192, 181, 0.1); }
    .search-input::placeholder { color: #6d8399; }

    .filter-group { display: flex; flex-direction: column; gap: 4px; }
    .filter-group label { font-size: 11px; font-weight: 600; color: #6d8399; text-transform: uppercase; letter-spacing: 0.5px; }
    .filter-input {
      padding: 10px 12px; border: 1px solid rgba(125, 192, 181, 0.15);
      border-radius: 10px; background: rgba(37, 61, 82, 0.6); color: #EFE5D0;
      font-size: 13px; outline: none; transition: all 0.2s ease;
    }
    .filter-input:focus { border-color: rgba(125, 192, 181, 0.4); }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .btn-secondary { background: rgba(125, 192, 181, 0.1); color: #a8b8c8; }
    .btn-secondary:hover { background: rgba(125, 192, 181, 0.2); }

    .loading-container { display: flex; justify-content: center; padding: 80px; }
    .spinner { width: 36px; height: 36px; border: 3px solid rgba(125, 192, 181, 0.2); border-top-color: #508A7B; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .table-card {
      background: linear-gradient(135deg, rgba(37, 61, 82, 0.8), rgba(37, 61, 82, 0.5));
      border: 1px solid rgba(125, 192, 181, 0.1); border-radius: 16px; overflow: hidden;
    }
    .table-wrapper { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      text-align: left; padding: 14px 16px; font-size: 12px; font-weight: 600;
      color: #6d8399; text-transform: uppercase; letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(125, 192, 181, 0.1); background: rgba(26, 47, 66, 0.5);
    }
    .data-table td { padding: 14px 16px; font-size: 14px; color: #cbd5e1; border-bottom: 1px solid rgba(125, 192, 181, 0.05); }
    .table-row { transition: background 0.15s ease; }
    .table-row:hover td { background: rgba(125, 192, 181, 0.04); }
    .vehicle-num { font-weight: 700; color: #EFE5D0; font-family: monospace; font-size: 13px; }
    .driver-name { font-size: 13px; color: #cbd5e1; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
    .date-cell { font-size: 13px; color: #a8b8c8; }
    .duration-stack { display: flex; flex-direction: column; gap: 2px; }
    .expected-text { font-size: 11px; color: #6d8399; }
    .fee-cell { color: #cbd5e1; }
    .fine-cell { color: #e07a78; }
    .total-cell { font-weight: 700; color: #7DC0B5; }
    .right-align { text-align: right; }

    .btn-action {
      background: rgba(125, 192, 181, 0.1); color: #7DC0B5; border: none;
      padding: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .btn-action:hover { background: rgba(125, 192, 181, 0.2); color: #EFE5D0; }
    .btn-action svg { width: 16px; height: 16px; }

    .sortable { cursor: pointer; user-select: none; }
    .sortable:hover { color: #7DC0B5; }
    .sort-indicator { color: #7DC0B5; font-size: 12px; margin-left: 4px; }

    .type-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    [data-type="car"] { background: rgba(125, 192, 181, 0.15); color: #7DC0B5; }
    [data-type="motorcycle"] { background: rgba(14, 165, 233, 0.15); color: #38bdf8; }
    [data-type="suv"] { background: rgba(245, 158, 11, 0.15); color: #d4a953; }
    [data-type="truck"] { background: rgba(239, 68, 68, 0.15); color: #e07a78; }

    .status-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .status-badge.completed { background: rgba(16, 185, 129, 0.15); color: #7DC0B5; }

    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px; color: #6d8399; gap: 8px; }
    .empty-icon { width: 48px; height: 48px; }
    .empty-state p { margin: 0; font-weight: 600; font-size: 16px; color: #a8b8c8; }
    .empty-state span { font-size: 13px; }

    .pagination {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-top: 1px solid rgba(125, 192, 181, 0.08);
    }
    .page-info { font-size: 13px; color: #6d8399; }
    .page-buttons { display: flex; gap: 6px; }
    .page-btn {
      padding: 6px 12px; border: 1px solid rgba(125, 192, 181, 0.1); border-radius: 8px;
      background: rgba(26, 47, 66, 0.4); color: #a8b8c8; font-size: 13px; font-weight: 500;
      cursor: pointer; transition: all 0.2s ease;
    }
    .page-btn:hover:not(:disabled) { border-color: rgba(125, 192, 181, 0.3); color: #7DC0B5; }
    .page-btn.active { background: rgba(125, 192, 181, 0.2); color: #7DC0B5; border-color: rgba(125, 192, 181, 0.3); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ParkingRecordsComponent implements OnInit {
  records: ParkingSession[] = [];
  allSlots: ParkingSlot[] = [];
  loading = true;
  searchQuery = '';
  dateFrom = '';
  dateTo = '';
  slotFilter = '';
  sortBy = 'entryTime';
  sortOrder: 'asc' | 'desc' = 'desc';
  currentPage = 1;
  pageSize = 8;
  meta: PaginationMeta | null = null;
  Math = Math;

  private searchTimeout: any;

  constructor(
    private recordsService: ParkingRecordsService,
    private slotService: ParkingSlotService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit() {
    this.slotService.getAll().subscribe(res => { this.allSlots = res.data; });
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    this.recordsService.getRecords({
      search: this.searchQuery,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      slot: this.slotFilter,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    }).subscribe(res => {
      this.records = res.data;
      this.meta = res.meta || null;
      this.loading = false;
    });
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadRecords();
    }, 300);
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadRecords();
  }

  sort(column: string) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'desc';
    }
    this.loadRecords();
  }

  resetFilters() {
    this.searchQuery = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.slotFilter = '';
    this.sortBy = 'entryTime';
    this.sortOrder = 'desc';
    this.currentPage = 1;
    this.loadRecords();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadRecords();
  }

  getPages(): number[] {
    if (!this.meta) return [];
    const pages: number[] = [];
    for (let i = 1; i <= this.meta.totalPages; i++) pages.push(i);
    return pages;
  }

  formatDuration(minutes: number | null | undefined): string {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  downloadReceipt(record: ParkingSession) {
    this.receiptService.generateReceipt(record);
  }
}

