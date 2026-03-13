import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div class="logo-text" *ngIf="!isCollapsed">
            <h1 class="logo-title">ParkFlow</h1>
            <p class="logo-subtitle">Management System</p>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems" [routerLink]="item.route" routerLinkActive="active" class="nav-item" [title]="item.label">
          <span class="nav-icon" [innerHTML]="safeIcon(item.icon)"></span>
          <span class="nav-label" *ngIf="!isCollapsed">{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button (click)="logout()" class="logout-btn" [title]="'Logout'">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span *ngIf="!isCollapsed">Logout</span>
        </button>
        <button (click)="toggleCollapse()" class="collapse-btn" [title]="isCollapsed ? 'Expand' : 'Collapse'">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" [style.transform]="isCollapsed ? 'rotate(180deg)' : ''">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: linear-gradient(180deg, #1a2f42 0%, #1e3448 100%);
      border-right: 1px solid rgba(125, 192, 181, 0.12);
      display: flex;
      flex-direction: column;
      transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 50;
      overflow: hidden;
    }
    .sidebar.collapsed { width: 64px; }
    .sidebar.collapsed .nav-item { justify-content: center; padding: 10px 0; }
    .sidebar.collapsed .nav-item .nav-icon { margin: 0 auto; }
    .sidebar.collapsed .sidebar-nav { padding: 12px 6px; }
    .sidebar.collapsed .sidebar-header { padding: 16px 14px; justify-content: center; }
    .sidebar.collapsed .logo-section { justify-content: center; }

    .sidebar-header {
      padding: 16px 12px;
      border-bottom: 1px solid rgba(125, 192, 181, 0.1);
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      min-width: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #508A7B, #7DC0B5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .logo-icon svg { width: 20px; height: 20px; }
    .logo-title {
      font-size: 16px;
      font-weight: 700;
      color: #EFE5D0;
      margin: 0;
      white-space: nowrap;
    }
    .logo-subtitle {
      font-size: 10px;
      color: #7DC0B5;
      margin: 0;
      white-space: nowrap;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #a8b8c8;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
      overflow: hidden;
    }
    .nav-item:hover {
      background: rgba(80, 138, 123, 0.12);
      color: #EFE5D0;
    }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(80, 138, 123, 0.25), rgba(125, 192, 181, 0.12));
      color: #7DC0B5;
      box-shadow: inset 3px 0 0 #7DC0B5;
    }
    .nav-icon {
      width: 20px;
      height: 20px;
      min-width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-icon :deep(svg) { width: 20px; height: 20px; }

    .sidebar-footer {
      padding: 12px 8px;
      border-top: 1px solid rgba(125, 192, 181, 0.1);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #e07a78;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
    }
    .logout-btn:hover { background: rgba(192, 96, 94, 0.1); }
    .logout-btn svg { width: 20px; height: 20px; min-width: 20px; margin: 0 auto; }
    
    .sidebar.collapsed .logout-btn { justify-content: center; padding: 10px 0; }
    .sidebar.collapsed .logout-btn span { display: none; }
    .sidebar.collapsed .logout-btn svg { margin: 0 auto; }
    .collapse-btn {
      width: 36px;
      height: 36px;
      margin: 0 auto;
      padding: 0;
      border: none;
      border-radius: 8px;
      background: rgba(80, 138, 123, 0.1);
      color: #7DC0B5;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .collapse-btn svg {
      width: 16px;
      height: 16px;
      transition: transform 0.25s ease;
    }
    .collapse-btn:hover {
      background: rgba(80, 138, 123, 0.2);
      color: #EFE5D0;
    }

    @media (max-width: 768px) {
      .sidebar { width: 64px; }
      .sidebar.collapsed { width: 0; border: none; }
      .logo-text { display: none; }
      .nav-label { display: none; }
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {}

  safeIcon(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  logout() {
    this.authService.logout();
  }

  navItems = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>',
    },
    {
      label: 'Parking Slots',
      route: '/slots',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>',
    },
    {
      label: 'Vehicle Entry/Exit',
      route: '/vehicle',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>',
    },
    {
      label: 'Parking Records',
      route: '/records',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>',
    },
  ];

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
