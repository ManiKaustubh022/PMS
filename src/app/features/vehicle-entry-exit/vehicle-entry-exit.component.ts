import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkingSessionService } from '../../core/services/parking-session.service';
import { ParkingSlotService } from '../../core/services/parking-slot.service';
import { ParkingSession, ParkingSlot } from '../../core/models';

@Component({
  selector: 'app-vehicle-entry-exit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="vehicle-page">
      <div class="two-col">
        <!-- Entry Form -->
        <div class="form-card">
          <div class="card-header">
            <div class="card-icon entry-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0-6.75-6.75M12 19.5l6.75-6.75" /></svg>
            </div>
            <div>
              <h3>Register Vehicle Entry</h3>
              <p>Assign a parking slot to an incoming vehicle</p>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>Vehicle Number <span class="required">*</span></label>
              <input type="text" [(ngModel)]="entryForm.vehicleNumber" placeholder="e.g., MH-12-AB-1234" class="form-input" id="vehicle-number-input" />
            </div>
            <div class="form-group">
              <label>Vehicle Type <span class="required">*</span></label>
              <div class="type-grid">
                <button *ngFor="let t of vehicleTypes" class="type-btn" [class.selected]="entryForm.vehicleType === t.value" (click)="entryForm.vehicleType = t.value">
                  <span class="type-emoji">{{ t.emoji }}</span>
                  <span>{{ t.label }}</span>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Assign Slot <span class="required">*</span></label>
              <select [(ngModel)]="entryForm.assignedSlot" class="form-input">
                <option value="">Select available slot</option>
                <option *ngFor="let s of availableSlots" [value]="s.slotNumber">
                  {{ s.slotNumber }} ({{ s.slotType | titlecase }})
                </option>
              </select>
            </div>
            <button class="btn btn-primary full-width" (click)="registerEntry()" [disabled]="!isEntryValid()" id="register-entry-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0-6.75-6.75M12 19.5l6.75-6.75" /></svg>
              Register Entry
            </button>
          </div>
        </div>

        <!-- Active Sessions -->
        <div class="sessions-card">
          <div class="card-header">
            <div class="card-icon active-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
            </div>
            <div>
              <h3>Active Sessions</h3>
              <p>{{ activeSessions.length }} vehicle(s) currently parked</p>
            </div>
          </div>
          <div class="card-body">
            <div *ngIf="loadingSessions" class="loading-container">
              <div class="spinner"></div>
            </div>
            <div *ngIf="!loadingSessions && activeSessions.length === 0" class="empty-state">
              <p>No active parking sessions</p>
            </div>
            <div class="session-list" *ngIf="!loadingSessions">
              <div *ngFor="let session of activeSessions" class="session-item">
                <div class="session-info">
                  <div class="session-vehicle">{{ session.vehicleNumber }}</div>
                  <div class="session-details">
                    <span class="session-type">{{ session.vehicleType | titlecase }}</span>
                    <span class="session-dot">•</span>
                    <span>Slot {{ session.assignedSlot }}</span>
                    <span class="session-dot">•</span>
                    <span class="session-time">{{ getElapsedTime(session.entryTime) }}</span>
                  </div>
                </div>
                <button class="btn btn-exit" (click)="exitVehicle(session)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75" /></svg>
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exit Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showExitModal" (click)="showExitModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirm Vehicle Exit</h3>
            <button class="modal-close" (click)="showExitModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="exit-summary" *ngIf="exitingSession">
              <div class="exit-row">
                <span class="exit-label">Vehicle</span>
                <span class="exit-value vehicle-num">{{ exitingSession.vehicleNumber }}</span>
              </div>
              <div class="exit-row">
                <span class="exit-label">Type</span>
                <span class="exit-value">{{ exitingSession.vehicleType | titlecase }}</span>
              </div>
              <div class="exit-row">
                <span class="exit-label">Slot</span>
                <span class="exit-value">{{ exitingSession.assignedSlot }}</span>
              </div>
              <div class="exit-row">
                <span class="exit-label">Entry Time</span>
                <span class="exit-value">{{ exitingSession.entryTime | date:'short' }}</span>
              </div>
              <div class="exit-row">
                <span class="exit-label">Duration</span>
                <span class="exit-value highlight">{{ getElapsedTime(exitingSession.entryTime) }}</span>
              </div>
              <div class="exit-row" *ngIf="exitResult">
                <span class="exit-label">Fee</span>
                <span class="exit-value fee">₹{{ exitResult.fee | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer" *ngIf="!exitResult">
            <button class="btn btn-secondary" (click)="showExitModal = false">Cancel</button>
            <button class="btn btn-primary" (click)="confirmExit()" [disabled]="processingExit">
              {{ processingExit ? 'Processing...' : 'Confirm Exit' }}
            </button>
          </div>
          <div class="modal-footer" *ngIf="exitResult">
            <div class="exit-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="success-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>Exit completed successfully!</span>
            </div>
            <button class="btn btn-primary" (click)="showExitModal = false; exitResult = null;">Done</button>
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
    .vehicle-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

    .form-card, .sessions-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.5));
      border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 16px; overflow: hidden;
    }
    .card-header {
      display: flex; align-items: center; gap: 14px;
      padding: 20px 24px; border-bottom: 1px solid rgba(99, 102, 241, 0.08);
    }
    .card-header h3 { margin: 0; font-size: 17px; font-weight: 600; color: #f1f5f9; }
    .card-header p { margin: 2px 0 0; font-size: 13px; color: #64748b; }
    .card-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .card-icon svg { width: 22px; height: 22px; }
    .entry-icon { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .active-icon { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .card-body { padding: 24px; }

    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 6px; }
    .required { color: #ef4444; }
    .form-input {
      width: 100%; padding: 10px 14px; border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: 10px; background: rgba(15, 23, 42, 0.6); color: #f1f5f9;
      font-size: 14px; outline: none; transition: all 0.2s ease; box-sizing: border-box;
    }
    .form-input:focus { border-color: rgba(99, 102, 241, 0.4); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
    .form-input::placeholder { color: #64748b; }

    .type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .type-btn {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 12px 8px; border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 10px;
      background: rgba(15, 23, 42, 0.4); color: #94a3b8; font-size: 12px; font-weight: 500;
      cursor: pointer; transition: all 0.2s ease;
    }
    .type-btn:hover { border-color: rgba(99, 102, 241, 0.2); }
    .type-btn.selected { border-color: #6366f1; background: rgba(99, 102, 241, 0.1); color: #818cf8; }
    .type-emoji { font-size: 22px; }

    .btn {
      display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s ease;
    }
    .btn-primary { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-secondary { background: rgba(99, 102, 241, 0.1); color: #94a3b8; }
    .btn-exit {
      background: rgba(239, 68, 68, 0.1); color: #f87171;
      padding: 8px 14px; font-size: 13px; border: 1px solid rgba(239, 68, 68, 0.15);
    }
    .btn-exit:hover { background: rgba(239, 68, 68, 0.2); }
    .btn-icon { width: 16px; height: 16px; }
    .full-width { width: 100%; justify-content: center; }

    .session-list { display: flex; flex-direction: column; gap: 10px; max-height: 450px; overflow-y: auto; }
    .session-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; border: 1px solid rgba(99, 102, 241, 0.08); border-radius: 12px;
      background: rgba(15, 23, 42, 0.3); transition: all 0.2s ease;
    }
    .session-item:hover { border-color: rgba(99, 102, 241, 0.15); background: rgba(15, 23, 42, 0.5); }
    .session-vehicle { font-weight: 700; color: #f1f5f9; font-family: monospace; font-size: 14px; }
    .session-details { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; margin-top: 4px; }
    .session-type { color: #818cf8; font-weight: 500; }
    .session-dot { color: #334155; }
    .session-time { color: #fbbf24; font-weight: 500; }

    .loading-container { display: flex; justify-content: center; padding: 40px; }
    .spinner { width: 32px; height: 32px; border: 3px solid rgba(99, 102, 241, 0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 40px; color: #64748b; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6);
      display: flex; align-items: center; justify-content: center; z-index: 100;
      backdrop-filter: blur(4px); animation: fadeIn 0.15s ease;
    }
    .modal {
      background: #1e293b; border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 16px; width: 440px; max-width: 90vw; animation: slideUp 0.2s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid rgba(99, 102, 241, 0.1);
    }
    .modal-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #f1f5f9; }
    .modal-close {
      width: 32px; height: 32px; border: none; border-radius: 8px;
      background: rgba(99, 102, 241, 0.1); color: #94a3b8; cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
    }
    .modal-body { padding: 24px; }
    .modal-footer {
      padding: 16px 24px; border-top: 1px solid rgba(99, 102, 241, 0.1);
      display: flex; justify-content: flex-end; gap: 10px; align-items: center;
    }

    .exit-summary { display: flex; flex-direction: column; gap: 12px; }
    .exit-row { display: flex; justify-content: space-between; align-items: center; }
    .exit-label { font-size: 13px; color: #64748b; }
    .exit-value { font-size: 14px; color: #f1f5f9; font-weight: 500; }
    .vehicle-num { font-family: monospace; }
    .highlight { color: #fbbf24; }
    .fee { font-size: 20px; font-weight: 700; color: #34d399; }

    .exit-success { display: flex; align-items: center; gap: 8px; color: #34d399; font-weight: 500; font-size: 14px; flex: 1; }
    .success-icon { width: 20px; height: 20px; }

    .toast {
      position: fixed; bottom: 24px; right: 24px; padding: 12px 20px;
      border-radius: 10px; font-size: 14px; font-weight: 500; z-index: 200;
      animation: slideUp 0.3s ease;
    }
    .toast.success { background: rgba(16, 185, 129, 0.9); color: white; }
    .toast.error { background: rgba(239, 68, 68, 0.9); color: white; }
  `]
})
export class VehicleEntryExitComponent implements OnInit {
  availableSlots: ParkingSlot[] = [];
  activeSessions: ParkingSession[] = [];
  loadingSessions = true;
  showExitModal = false;
  processingExit = false;
  exitingSession: ParkingSession | null = null;
  exitResult: ParkingSession | null = null;
  toast: { message: string; type: string } | null = null;

  entryForm = {
    vehicleNumber: '',
    vehicleType: 'car' as ParkingSession['vehicleType'],
    assignedSlot: '',
  };

  vehicleTypes = [
    { value: 'car' as const, label: 'Car', emoji: '🚗' },
    { value: 'motorcycle' as const, label: 'Bike', emoji: '🏍️' },
    { value: 'suv' as const, label: 'SUV', emoji: '🚙' },
    { value: 'truck' as const, label: 'Truck', emoji: '🚛' },
  ];

  constructor(
    private sessionService: ParkingSessionService,
    private slotService: ParkingSlotService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingSessions = true;
    this.slotService.getAvailableSlots().subscribe(res => {
      this.availableSlots = res.data;
    });
    this.sessionService.getActiveSessions().subscribe(res => {
      this.activeSessions = res.data;
      this.loadingSessions = false;
    });
  }

  isEntryValid(): boolean {
    return !!(this.entryForm.vehicleNumber && this.entryForm.vehicleType && this.entryForm.assignedSlot);
  }

  registerEntry() {
    if (!this.isEntryValid()) return;
    this.sessionService.createEntry(this.entryForm).subscribe(res => {
      if (res.success) {
        this.showToast('Vehicle entry registered!', 'success');
        this.entryForm = { vehicleNumber: '', vehicleType: 'car', assignedSlot: '' };
        this.loadData();
      }
    });
  }

  getElapsedTime(entryTime: string): string {
    const now = new Date();
    const entry = new Date(entryTime);
    const diffMs = now.getTime() - entry.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  }

  exitVehicle(session: ParkingSession) {
    this.exitingSession = session;
    this.exitResult = null;
    this.processingExit = false;
    this.showExitModal = true;
  }

  confirmExit() {
    if (!this.exitingSession) return;
    this.processingExit = true;
    this.sessionService.completeExit(this.exitingSession.id).subscribe(res => {
      this.processingExit = false;
      if (res.success && res.data) {
        this.exitResult = res.data;
        this.loadData();
      }
    });
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }
}
