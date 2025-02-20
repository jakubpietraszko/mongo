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

@Component({
  selector: 'app-register-admin',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css',
})
export class RegisterAdminComponent {
  registerForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService
        .registerAdmin({
          email,
          password,
          role: 'admin',
        })
        .subscribe({
          next: (response: any) => {
            // Handle successful login (e.g., store token, navigate to another page)
            this.router.navigate(['/']);
          },
          error: (error) => {
            // Show error message if login fails
            this.errorMessage = error; // Display specific error message from the backend
          },
        });
    } else {
      console.log('Form is invalid');
      this.router.navigate(['/register-admin']);
      return;
    }
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }
}
