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
  selector: 'app-register-patient',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.css',
})
export class RegisterPatientComponent {
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
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  onRegister(): void {

    if (this.registerForm.valid) {
      const { email, password, name, surname, birthdate, gender } = this.registerForm.value;
      this.authService.registerPatient({
        email,
        password,
        role: 'patient',
        name,
        surname,
        ban: false,
        birthdate,
        gender
      }).subscribe({
        next: (response: any) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error;
        },
      })

    } else {
      console.log('Form is invalid');
      this.router.navigate(['/register-patient']);
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

  get birthdate() {
    return this.registerForm.get('birthdate');
  }

  get gender() {
    return this.registerForm.get('gender');
  }
}
