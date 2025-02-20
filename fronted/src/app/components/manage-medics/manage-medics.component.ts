import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicsService } from '../../services/medics.service';

@Component({
  selector: 'app-manage-medics',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './manage-medics.component.html',
  styleUrl: './manage-medics.component.css'
})
export class ManageMedicsComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<string>();

  medics: any[] = []; // Holds the medics data
  errorMessage = ''; // Holds error messages, if any
  medicForms: FormGroup[] = [];
  editIndex: number | null = null;  // To track which medic is being edited
  isCreating: boolean = false;
  newMedicForm: FormGroup;

  constructor(private medicsService: MedicsService,
              private fb: FormBuilder) {

    this.newMedicForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject for real-time updates

    console.log('Subscribing to currentMedics');

    this.medicsService.currentMedics.subscribe({
      next: (data: any[]) => {
        this.medics = data;
        this.medicForms = data.map((medic: any) => this.createMedicForm(medic));
      },
      error: (error) => {
        this.errorMessage = 'Failed to load medics. Please try again later.';
        console.error('Error fetching medics:', error);
      },
    });

    // Fetch the initial medics
    this.medicsService.updateMedics();
  }

  createMedicForm(medic: any): FormGroup {
    return this.fb.group({
      _id: [medic._id, Validators.required],  // Ensure _id is correctly set
      name: [medic.name, Validators.required],
      surname: [medic.surname, Validators.required],
      type: [medic.type, Validators.required],
    });
  }

  editMedic(index: number): void {
    this.editIndex = index;
  }

  saveMedic(index: number): void {
    const updatedMedic = this.medicForms[index].value;
    const medicId = updatedMedic._id;
    delete updatedMedic._id;  // Remove _id from the object

    this.medicsService.updateMedic(medicId, updatedMedic).subscribe({
      next: (response) => {
        console.log('Medic updated:', response);
        this.editIndex = null;  // Reset the edit index
      },
      error: (error) => {
        console.error('Error updating medic:', error);
        this.errorMessage = 'Failed to update medic. Please try again later.';
      },
    });
  }

  deleteMedic(index: number): void {
    const medicId = this.medicForms[index].value._id;

    this.medicsService.deleteMedic(medicId).subscribe({
      next: (response) => {
        console.log('Medic deleted:', response);
      },
      error: (error) => {
        console.error('Error deleting medic:', error);
        this.errorMessage = 'Failed to delete medic. Please try again later.';
      },
    });
  }

  saveNewMedic(): void {
    if(this.newMedicForm.valid){
      console.log('new medic fom is valid');

      const newMedic = this.newMedicForm.value;
      console.log('new medic:', newMedic);

      this.medicsService.createMedic(newMedic).subscribe({
        next: () =>{
          console.log('Medic created successfully');
          this.isCreating = false;
        },
        error: (error) => {
          console.error('Error creating medic:', error);
          this.errorMessage = 'Failed to create medic. Please try again later.';
        },
      })

    }
  }

  cancelEdit(): void {
    this.editIndex = null;
  }

  createNewMedic(): void {
    this.isCreating = true;
  }

  cancelCreate(): void {
    this.isCreating = false;
  }


}
