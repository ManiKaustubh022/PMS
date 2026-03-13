import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-area">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h1>ParkFlow</h1>
          <p>Admin Portal</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" formControlName="username" class="form-input" placeholder="Enter username" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-input" placeholder="Enter password" />
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-btn" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner-small"></span>
            <span *ngIf="!isLoading">Login</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3448 0%, #172635 100%);
      padding: 20px;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      background: rgba(37, 61, 82, 0.9);
      border: 1px solid rgba(125, 192, 181, 0.2);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .logo-area { text-align: center; margin-bottom: 30px; }
    .logo-icon {
      width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 16px;
      background: linear-gradient(135deg, #508A7B, #7DC0B5);
      display: flex; align-items: center; justify-content: center; color: white;
    }
    .logo-icon svg { width: 32px; height: 32px; }
    .logo-area h1 { margin: 0; font-size: 24px; font-weight: 700; color: #EFE5D0; }
    .logo-area p { margin: 4px 0 0; font-size: 14px; color: #7DC0B5; }

    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #a8b8c8; margin-bottom: 8px; }
    .form-input {
      width: 100%; padding: 12px 16px; border: 1px solid rgba(125, 192, 181, 0.2);
      border-radius: 10px; background: rgba(26, 47, 66, 0.8); color: #EFE5D0;
      font-size: 14px; outline: none; transition: all 0.2s ease; box-sizing: border-box;
    }
    .form-input:focus { border-color: rgba(125, 192, 181, 0.5); box-shadow: 0 0 0 3px rgba(125, 192, 181, 0.1); }
    
    .error-message {
      background: rgba(192, 96, 94, 0.1); color: #e07a78; padding: 10px 14px;
      border-radius: 8px; font-size: 13px; margin-bottom: 20px; text-align: center;
      border: 1px solid rgba(192, 96, 94, 0.2);
    }
    
    .login-btn {
      width: 100%; padding: 12px; border: none; border-radius: 10px;
      background: linear-gradient(135deg, #508A7B, #3d6e62); color: white;
      font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
      display: flex; align-items: center; justify-content: center; height: 46px;
    }
    .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(80, 138, 123, 0.4); }
    .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .spinner-small {
      width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['admin', Validators.required],
      password: ['0000', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message || 'Login failed';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid username or password';
      }
    });
  }
}
