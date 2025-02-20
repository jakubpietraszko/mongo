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
  selector: 'app-register-medic',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-medic.component.html',
  styleUrl: './register-medic.component.css',
})
export class RegisterMedicComponent {
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
      name: ['', Validators.required],
      surname: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  onRegister(): void {
    if (this.registerForm.valid){
      const { email, password, name, surname, type } = this.registerForm.value;
      this.authService.registerMedic({
        email,
        password,
        role: 'medic',
        name,
        surname,
        type
      }).subscribe({
        next: (response: any) => {
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error.error;
        }
      })
    } else{
      console.log('Form is invalid');
      this.router.navigate(['/register-medic']);
      return;
    }
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get name() {
    return this.registerForm.get('name');
  }

  get surname() {
    return this.registerForm.get('surname');
  }

  get type() {
    return this.registerForm.get('type');
  }
}
