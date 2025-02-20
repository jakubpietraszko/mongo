import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response: any) => {
          // Handle successful login (e.g., store token, navigate to another page)
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.router.navigate(['/']);
        },
        error: (error) => {
          // Show error message if login fails
          this.errorMessage = error; // Display specific error message from the backend
        },
      });
    } else {
      // Handle form invalid case (e.g., show error messages)
      console.log('Form is invalid');
      this.router.navigate(['/login']);
      return;
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
