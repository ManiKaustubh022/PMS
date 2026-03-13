import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkingSlotService } from '../../core/services/parking-slot.service';
import { ParkingSlot } from '../../core/models';

@Component({
  selector: 'app-parking-slots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="slots-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h2 class="section-title">Parking Slots</h2>
          <p class="section-subtitle">Manage and monitor parking slot availability</p>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()" id="add-slot-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Slot
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button *ngFor="let f of filters" class="filter-tab" [class.active]="activeFilter === f.value" (click)="setFilter(f.value)">
          {{ f.label }}
          <span class="filter-count">{{ getCount(f.value) }}</span>
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
      </div>

      <!-- Slots Table -->
      <div *ngIf="!loading" class="table-card">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Slot Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let slot of filteredSlots" class="table-row">
                <td class="slot-num">{{ slot.slotNumber }}</td>
                <td>
                  <span class="type-badge" [attr.data-type]="slot.slotType">{{ slot.slotType | titlecase }}</span>
                </td>
                <td>
                  <span class="status-badge" [class.available]="slot.isAvailable" [class.occupied]="!slot.isAvailable">
                    <span class="status-dot"></span>
                    {{ slot.isAvailable ? 'Available' : 'Occupied' }}
                  </span>
                </td>
                <td class="date-cell">{{ slot.createdAt | date:'mediumDate' }}</td>
                <td class="date-cell">{{ slot.updatedAt | date:'short' }}</td>
                <td>
                  <div class="actions">
                    <button class="action-btn edit" (click)="openEditModal(slot)" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                    </button>
                    <button class="action-btn toggle" (click)="toggleAvailability(slot)" [title]="slot.isAvailable ? 'Mark Occupied' : 'Mark Available'">
                      <svg *ngIf="slot.isAvailable" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      <svg *ngIf="!slot.isAvailable" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    </button>
                    <button class="action-btn delete" (click)="deleteSlot(slot)" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredSlots.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="empty-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
          <p>No slots found</p>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingSlot ? 'Edit Slot' : 'Add New Slot' }}</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Slot Number</label>
              <input type="text" [(ngModel)]="formData.slotNumber" placeholder="e.g., A-05" class="form-input" />
            </div>
            <div class="form-group">
              <label>Slot Type</label>
              <select [(ngModel)]="formData.slotType" class="form-input">
                <option value="compact">Compact</option>
                <option value="standard">Standard</option>
                <option value="large">Large</option>
                <option value="handicapped">Handicapped</option>
              </select>
            </div>
            <div class="form-group" *ngIf="editingSlot">
              <label>Availability</label>
              <select [(ngModel)]="formData.isAvailable" class="form-input">
                <option [ngValue]="true">Available</option>
                <option [ngValue]="false">Occupied</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveSlot()" [disabled]="!formData.slotNumber">
              {{ editingSlot ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
        <div class="modal small-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirm Delete</h3>
            <button class="modal-close" (click)="showDeleteModal = false">✕</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete slot <strong>{{ deletingSlot?.slotNumber }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showDeleteModal = false">Cancel</button>
            <button class="btn btn-danger" (click)="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" class="toast" [class.success]="toast.type === 'success'" [class.error]="toast.type === 'error'">
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [`
    .slots-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .section-title { font-size: 22px; font-weight: 700; color: #EFE5D0; margin: 0; }
    .section-subtitle { font-size: 14px; color: #6d8399; margin: 4px 0 0; }

    .btn {
      display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s ease;
    }
    .btn-primary { background: linear-gradient(135deg, #508A7B, #3d6e62); color: white; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(125, 192, 181, 0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-secondary { background: rgba(125, 192, 181, 0.1); color: #a8b8c8; }
    .btn-secondary:hover { background: rgba(125, 192, 181, 0.2); }
    .btn-danger { background: linear-gradient(135deg, #c0605e, #dc2626); color: white; }
    .btn-danger:hover { box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); }
    .btn-icon { width: 16px; height: 16px; }

    .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
    .filter-tab {
      padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(125, 192, 181, 0.1);
      background: rgba(37, 61, 82, 0.5); color: #a8b8c8; font-size: 13px; font-weight: 500;
      cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px;
    }
    .filter-tab:hover { border-color: rgba(125, 192, 181, 0.2); }
    .filter-tab.active { background: rgba(125, 192, 181, 0.15); color: #7DC0B5; border-color: rgba(125, 192, 181, 0.3); }
    .filter-count {
      padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 700;
      background: rgba(125, 192, 181, 0.15); color: #7DC0B5;
    }

    .loading-container { display: flex; justify-content: center; padding: 80px; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(125, 192, 181, 0.2); border-top-color: #508A7B;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
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
    .slot-num { font-weight: 700; color: #EFE5D0; font-family: monospace; font-size: 14px; }
    .date-cell { font-size: 13px; color: #a8b8c8; }

    .type-badge {
      padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
    }
    [data-type="compact"] { background: rgba(14, 165, 233, 0.15); color: #38bdf8; }
    [data-type="standard"] { background: rgba(125, 192, 181, 0.15); color: #7DC0B5; }
    [data-type="large"] { background: rgba(245, 158, 11, 0.15); color: #d4a953; }
    [data-type="handicapped"] { background: rgba(16, 185, 129, 0.15); color: #7DC0B5; }

    .status-badge {
      display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
      border-radius: 6px; font-size: 12px; font-weight: 600;
    }
    .status-badge.available { background: rgba(16, 185, 129, 0.15); color: #7DC0B5; }
    .status-badge.occupied { background: rgba(245, 158, 11, 0.15); color: #d4a953; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-badge.available .status-dot { background: #7DC0B5; }
    .status-badge.occupied .status-dot { background: #d4a953; }

    .actions { display: flex; gap: 6px; }
    .action-btn {
      width: 32px; height: 32px; border: none; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s ease;
    }
    .action-btn svg { width: 16px; height: 16px; }
    .action-btn.edit { background: rgba(125, 192, 181, 0.1); color: #7DC0B5; }
    .action-btn.edit:hover { background: rgba(125, 192, 181, 0.25); }
    .action-btn.toggle { background: rgba(14, 165, 233, 0.1); color: #38bdf8; }
    .action-btn.toggle:hover { background: rgba(14, 165, 233, 0.25); }
    .action-btn.delete { background: rgba(239, 68, 68, 0.1); color: #e07a78; }
    .action-btn.delete:hover { background: rgba(239, 68, 68, 0.25); }

    .empty-state {
      display: flex; flex-direction: column; align-items: center; padding: 60px;
      color: #6d8399; gap: 12px;
    }
    .empty-icon { width: 48px; height: 48px; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6);
      display: flex; align-items: center; justify-content: center; z-index: 100;
      backdrop-filter: blur(4px); animation: fadeIn 0.15s ease;
    }
    .modal {
      background: #253d52; border: 1px solid rgba(125, 192, 181, 0.2);
      border-radius: 16px; width: 440px; max-width: 90vw;
      animation: slideUp 0.2s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .small-modal { width: 380px; }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid rgba(125, 192, 181, 0.1);
    }
    .modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #EFE5D0; }
    .modal-close {
      width: 32px; height: 32px; border: none; border-radius: 8px;
      background: rgba(125, 192, 181, 0.1); color: #a8b8c8; cursor: pointer;
      font-size: 16px; display: flex; align-items: center; justify-content: center;
    }
    .modal-close:hover { background: rgba(125, 192, 181, 0.2); }
    .modal-body { padding: 24px; }
    .modal-body p { color: #a8b8c8; margin: 0; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid rgba(125, 192, 181, 0.1); display: flex; justify-content: flex-end; gap: 10px; }

    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #a8b8c8; margin-bottom: 6px; }
    .form-input {
      width: 100%; padding: 10px 14px; border: 1px solid rgba(125, 192, 181, 0.15);
      border-radius: 10px; background: rgba(26, 47, 66, 0.6); color: #EFE5D0;
      font-size: 14px; outline: none; transition: all 0.2s ease; box-sizing: border-box;
    }
    .form-input:focus { border-color: rgba(125, 192, 181, 0.4); box-shadow: 0 0 0 3px rgba(125, 192, 181, 0.1); }
    .form-input::placeholder { color: #6d8399; }
    select.form-input { cursor: pointer; }

    .toast {
      position: fixed; bottom: 24px; right: 24px; padding: 12px 20px;
      border-radius: 10px; font-size: 14px; font-weight: 500; z-index: 200;
      animation: slideUp 0.3s ease;
    }
    .toast.success { background: rgba(16, 185, 129, 0.9); color: white; }
    .toast.error { background: rgba(239, 68, 68, 0.9); color: white; }
  `]
})
export class ParkingSlotsComponent implements OnInit {
  slots: ParkingSlot[] = [];
  filteredSlots: ParkingSlot[] = [];
  loading = true;
  activeFilter = 'all';
  showModal = false;
  showDeleteModal = false;
  editingSlot: ParkingSlot | null = null;
  deletingSlot: ParkingSlot | null = null;
  toast: { message: string; type: string } | null = null;

  formData = {
    slotNumber: '',
    slotType: 'standard' as ParkingSlot['slotType'],
    isAvailable: true,
  };

  filters = [
    { label: 'All Slots', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Occupied', value: 'occupied' },
  ];

  constructor(private slotService: ParkingSlotService) {}

  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.loading = true;
    this.slotService.getAll().subscribe(res => {
      this.slots = res.data;
      this.applyFilter();
      this.loading = false;
    });
  }

  setFilter(value: string) {
    this.activeFilter = value;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeFilter === 'available') {
      this.filteredSlots = this.slots.filter(s => s.isAvailable);
    } else if (this.activeFilter === 'occupied') {
      this.filteredSlots = this.slots.filter(s => !s.isAvailable);
    } else {
      this.filteredSlots = [...this.slots];
    }
  }

  getCount(filter: string): number {
    if (filter === 'available') return this.slots.filter(s => s.isAvailable).length;
    if (filter === 'occupied') return this.slots.filter(s => !s.isAvailable).length;
    return this.slots.length;
  }

  openAddModal() {
    this.editingSlot = null;
    this.formData = { slotNumber: '', slotType: 'standard', isAvailable: true };
    this.showModal = true;
  }

  openEditModal(slot: ParkingSlot) {
    this.editingSlot = slot;
    this.formData = { slotNumber: slot.slotNumber, slotType: slot.slotType, isAvailable: slot.isAvailable };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingSlot = null;
  }

  saveSlot() {
    if (this.editingSlot) {
      this.slotService.update(this.editingSlot.id, this.formData).subscribe(res => {
        if (res.success) {
          this.showToast('Slot updated successfully', 'success');
          this.loadSlots();
          this.closeModal();
        }
      });
    } else {
      this.slotService.create(this.formData).subscribe(res => {
        if (res.success) {
          this.showToast('Slot created successfully', 'success');
          this.loadSlots();
          this.closeModal();
        }
      });
    }
  }

  toggleAvailability(slot: ParkingSlot) {
    this.slotService.updateAvailability(slot.id, !slot.isAvailable).subscribe(res => {
      if (res.success) {
        this.showToast(`Slot ${slot.slotNumber} marked as ${!slot.isAvailable ? 'available' : 'occupied'}`, 'success');
        this.loadSlots();
      }
    });
  }

  deleteSlot(slot: ParkingSlot) {
    this.deletingSlot = slot;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.deletingSlot) return;
    this.slotService.delete(this.deletingSlot.id).subscribe(res => {
      if (res.success) {
        this.showToast('Slot deleted', 'success');
        this.loadSlots();
        this.showDeleteModal = false;
      }
    });
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }
}

