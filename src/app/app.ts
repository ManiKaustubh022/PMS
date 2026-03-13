import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  template: `
    <app-sidebar *ngIf="isLoggedIn"></app-sidebar>
    <div [class.main-content]="isLoggedIn">
      <app-header *ngIf="isLoggedIn"></app-header>
      <main [class.page-content]="isLoggedIn">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      min-height: 100vh;
      background: #1e3448;
    }
    .main-content {
      flex: 1;
      margin-left: 240px;
      transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 0;
    }
    .page-content {
      padding: 20px 24px;
      min-height: calc(100vh - 56px);
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 64px; }
      .page-content { padding: 12px 14px; }
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(val => {
      this.isLoggedIn = val;
    });
    this.authService.verifyToken();
  }
}
