import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OnInit } from '@angular/core';
import { PatientsService } from '../../services/patients.service';

@Component({
  selector: 'app-manage-patients',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './manage-patients.component.html',
  styleUrl: './manage-patients.component.css',
})
export class ManagePatientsComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<string>();

  patients: any[] = []; // Holds the patients data
  errorMessage = ''; // Holds error messages, if any
  patientForms: FormGroup[] = [];
  editIndex: number | null = null; // To track which patient is being edited
  isCreating: boolean = false;
  newPatientForm: FormGroup;

  constructor(
    private patientsService: PatientsService,
    private fb: FormBuilder
  ) {
    this.newPatientForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ban: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('Subscribing to currentPatients');

    this.patientsService.currentPatients.subscribe({
      next: (data: any[]) => {
        this.patients = data;
        this.patientForms = data.map((patient: any) =>
          this.createPatientForm(patient)
        );
      },
      error: (error) => {
        this.errorMessage = 'Failed to load patients. Please try again later.';
        console.error('Error fetching patients:', error);
      },
    });

    this.patientsService.updatePatients();
  }

  createPatientForm(patient: any): FormGroup {
    return this.fb.group({
      _id: [patient._id, Validators.required],
      name: [patient.name, Validators.required],
      surname: [patient.surname, Validators.required],
      ban: [patient.ban, Validators.required],
      birthdate: [patient.birthdate, Validators.required],
      gender: [patient.gender, Validators.required],
    });
  }

  editPatient(index: number): void {
    this.editIndex = index;
  }

  savePatient(index: number): void {
    const updatedPatient = this.patientForms[index].value;
    const patientId = updatedPatient._id;

    delete updatedPatient._id;

    this.patientsService.updatePatient(patientId, updatedPatient).subscribe({
      next: () => {
        this.editIndex = null;
        console.log('Patient updated successfully');
      },
      error: (error) => {
        console.error('Error updating patient:', error);
        this.errorMessage = 'Failed to update patient. Please try again later.';
      },
    })
  }

  deletePatient(index: number): void {
    const patientId = this.patientForms[index].value._id;

    this.patientsService.deletePatient(patientId).subscribe({
      next: () => {
        console.log('Patient deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting patient:', error);
        this.errorMessage = 'Failed to delete patient. Please try again later.';
      },
    });
  }

  saveNewPatient(): void {
    if(this.newPatientForm.valid){
      console.log('Saving new patient:', this.newPatientForm.value);

      const newPatient = this.newPatientForm.value;

      this.patientsService.createPatient(newPatient).subscribe({
        next: () => {
          console.log('Patient created successfully');
          this.isCreating = false;
        },
        error: (error) => {
          console.error('Error creating patient:', error);
          this.errorMessage = 'Failed to create patient. Please try again later.';
        },
      })
    }
  }

  cancelEdit(): void {
    this.editIndex = null;
  }

  createNewPatient(): void {
    this.isCreating = true;
  }

  cancelCreate(): void {
    this.isCreating = false;
  }
}
