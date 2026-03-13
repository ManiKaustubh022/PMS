import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <div class="main-content" [style.margin-left]="'260px'">
        <app-header></app-header>
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #0f172a;
    }
    .main-content {
      flex: 1;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .page-content {
      padding: 24px 28px;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class AppComponent {}
