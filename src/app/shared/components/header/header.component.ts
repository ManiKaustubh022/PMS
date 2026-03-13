import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <h2 class="page-title">{{ getPageTitle() }}</h2>
      </div>
      <div class="header-right">
        <div class="header-search">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input type="text" placeholder="Search..." class="search-input" />
        </div>
        <button class="notification-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span class="notification-badge">3</span>
        </button>
        <div class="user-avatar">
          <span>KM</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 64px;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(99, 102, 241, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: #f1f5f9;
      margin: 0;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header-search {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      width: 16px;
      height: 16px;
      color: #64748b;
    }
    .search-input {
      width: 220px;
      padding: 8px 12px 8px 36px;
      border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: 10px;
      background: rgba(30, 41, 59, 0.6);
      color: #f1f5f9;
      font-size: 13px;
      outline: none;
      transition: all 0.2s ease;
    }
    .search-input::placeholder { color: #64748b; }
    .search-input:focus {
      border-color: rgba(99, 102, 241, 0.4);
      background: rgba(30, 41, 59, 0.9);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .notification-btn {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 1px solid rgba(99, 102, 241, 0.1);
      background: rgba(30, 41, 59, 0.4);
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .notification-btn:hover {
      background: rgba(99, 102, 241, 0.1);
      color: #c7d2fe;
    }
    .notification-btn svg { width: 20px; height: 20px; }
    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class HeaderComponent {
  getPageTitle(): string {
    const path = window.location.pathname;
    if (path.includes('slots')) return 'Parking Slots';
    if (path.includes('vehicle')) return 'Vehicle Entry / Exit';
    if (path.includes('records')) return 'Parking Records';
    return 'Dashboard';
  }
}
