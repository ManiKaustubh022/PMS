import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading dashboard...</p>
      </div>

      <div *ngIf="!loading && stats">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card" id="total-slots-card">
            <div class="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Slots</span>
              <span class="stat-value">{{ stats.totalSlots }}</span>
            </div>
          </div>

          <div class="stat-card" id="available-slots-card">
            <div class="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Available</span>
              <span class="stat-value green-text">{{ stats.availableSlots }}</span>
            </div>
          </div>

          <div class="stat-card" id="occupied-slots-card">
            <div class="stat-icon orange">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Occupied</span>
              <span class="stat-value orange-text">{{ stats.occupiedSlots }}</span>
            </div>
          </div>

          <div class="stat-card" id="vehicles-today-card">
            <div class="stat-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Vehicles Today</span>
              <span class="stat-value">{{ stats.vehiclesParkedToday }}</span>
            </div>
          </div>

          <div class="stat-card wide" id="revenue-card">
            <div class="stat-icon emerald">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Today's Revenue</span>
              <span class="stat-value emerald-text">₹{{ stats.totalRevenueToday | number }}</span>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-row">
          <div class="chart-card">
            <h3 class="card-title">Slot Utilization</h3>
            <div class="chart-container doughnut-container">
              <canvas #doughnutChart></canvas>
            </div>
          </div>
          <div class="chart-card wide-chart">
            <h3 class="card-title">Weekly Revenue</h3>
            <div class="chart-container bar-container">
              <canvas #barChart></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-card">
          <h3 class="card-title">Recent Activity</h3>
          <div class="activity-table-wrapper">
            <table class="activity-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Action</th>
                  <th>Slot</th>
                  <th>Time</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of stats.recentActivity">
                  <td class="vehicle-num">{{ item.vehicleNumber }}</td>
                  <td>
                    <span class="action-badge" [class.entry]="item.action === 'entry'" [class.exit]="item.action === 'exit'">
                      {{ item.action === 'entry' ? '↓ Entry' : '↑ Exit' }}
                    </span>
                  </td>
                  <td>{{ item.slotNumber }}</td>
                  <td class="time-cell">{{ item.timestamp | date:'short' }}</td>
                  <td>{{ item.fee ? '₹' + item.fee : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      color: #a8b8c8;
      gap: 16px;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(125, 192, 181, 0.2);
      border-top-color: #508A7B;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: linear-gradient(135deg, rgba(37, 61, 82, 0.8), rgba(37, 61, 82, 0.5));
      border: 1px solid rgba(125, 192, 181, 0.1);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }
    .stat-card:hover {
      border-color: rgba(125, 192, 181, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    .stat-card.wide { grid-column: span 2; }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon svg { width: 24px; height: 24px; }
    .stat-icon.blue { background: rgba(125, 192, 181, 0.15); color: #7DC0B5; }
    .stat-icon.green { background: rgba(16, 185, 129, 0.15); color: #7DC0B5; }
    .stat-icon.orange { background: rgba(245, 158, 11, 0.15); color: #d4a953; }
    .stat-icon.purple { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }
    .stat-icon.emerald { background: rgba(16, 185, 129, 0.15); color: #7DC0B5; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-label { font-size: 13px; color: #a8b8c8; font-weight: 500; }
    .stat-value { font-size: 28px; font-weight: 700; color: #EFE5D0; margin-top: 2px; }
    .green-text { color: #7DC0B5 !important; }
    .orange-text { color: #d4a953 !important; }
    .emerald-text { color: #7DC0B5 !important; }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .chart-card {
      background: linear-gradient(135deg, rgba(37, 61, 82, 0.8), rgba(37, 61, 82, 0.5));
      border: 1px solid rgba(125, 192, 181, 0.1);
      border-radius: 16px;
      padding: 20px;
    }
    .card-title { font-size: 16px; font-weight: 600; color: #EFE5D0; margin: 0 0 16px; }
    .chart-container { position: relative; }
    .doughnut-container { height: 260px; display: flex; align-items: center; justify-content: center; }
    .bar-container { height: 260px; }

    .activity-card {
      background: linear-gradient(135deg, rgba(37, 61, 82, 0.8), rgba(37, 61, 82, 0.5));
      border: 1px solid rgba(125, 192, 181, 0.1);
      border-radius: 16px;
      padding: 20px;
    }
    .activity-table-wrapper { overflow-x: auto; }
    .activity-table {
      width: 100%;
      border-collapse: collapse;
    }
    .activity-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #6d8399;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(125, 192, 181, 0.1);
    }
    .activity-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #cbd5e1;
      border-bottom: 1px solid rgba(125, 192, 181, 0.05);
    }
    .activity-table tr:hover td { background: rgba(125, 192, 181, 0.04); }
    .vehicle-num { font-weight: 600; color: #EFE5D0; font-family: monospace; font-size: 13px; }
    .time-cell { font-size: 13px; color: #a8b8c8; }
    .action-badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    .action-badge.entry { background: rgba(16, 185, 129, 0.15); color: #7DC0B5; }
    .action-badge.exit { background: rgba(239, 68, 68, 0.15); color: #e07a78; }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .stat-card.wide { grid-column: span 1; }
      .charts-row { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  loading = true;
  private doughnutChartInstance: Chart | null = null;
  private barChartInstance: Chart | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {}

  loadStats() {
    this.loading = true;
    this.dashboardService.getStats().subscribe(res => {
      if (res.success) {
        this.stats = res.data;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 50);
      }
    });
  }

  private renderCharts() {
    if (!this.stats) return;

    // Doughnut Chart
    if (this.doughnutChartRef?.nativeElement) {
      if (this.doughnutChartInstance) this.doughnutChartInstance.destroy();
      this.doughnutChartInstance = new Chart(this.doughnutChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Available', 'Occupied'],
          datasets: [{
            data: [this.stats.slotUtilization.available, this.stats.slotUtilization.occupied],
            backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)'],
            borderColor: ['rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)'],
            borderWidth: 2,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { color: '#a8b8c8', padding: 16, font: { size: 13 } } },
          },
        },
      });
    }

    // Bar Chart
    if (this.barChartRef?.nativeElement) {
      if (this.barChartInstance) this.barChartInstance.destroy();
      this.barChartInstance = new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.stats.weeklyLabels,
          datasets: [{
            label: 'Revenue (₹)',
            data: this.stats.weeklyRevenue,
            backgroundColor: 'rgba(125, 192, 181, 0.6)',
            borderColor: 'rgba(125, 192, 181, 1)',
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { color: 'rgba(125, 192, 181, 0.05)' },
              ticks: { color: '#a8b8c8', font: { size: 12 } },
            },
            y: {
              grid: { color: 'rgba(125, 192, 181, 0.05)' },
              ticks: { color: '#a8b8c8', font: { size: 12 }, callback: (v) => '₹' + v },
            },
          },
        },
      });
    }
  }
}

