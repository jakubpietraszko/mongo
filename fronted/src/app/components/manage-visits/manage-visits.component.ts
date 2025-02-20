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
import { VisitsService } from '../../services/visits.service';

@Component({
  selector: 'app-manage-visits',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './manage-visits.component.html',
  styleUrl: './manage-visits.component.css',
})
export class ManageVisitsComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<string>();

  visits: any[] = []; // Holds the visits data
  errorMessage = ''; // Holds error messages, if any
  visitForms: FormGroup[] = [];
  editIndex: number | null = null; // To track which visit is being edited
  isCreating: boolean = false;
  newVisitForm: FormGroup;

  constructor(private visitsService: VisitsService, private fb: FormBuilder) {
    this.newVisitForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      endTime: ['', Validators.required],
      medicUid: ['', Validators.required],
      paid: ['', Validators.required],
      patientUid: ['', Validators.required],
      startTime: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject for real-time updates

    console.log('Subscribing to currentVisits');

    this.visitsService.currentVisits.subscribe({
      next: (data: any[]) => {
        this.visits = data;
        this.visitForms = data.map((visit: any) => this.createVisitForm(visit));
      },
      error: (error) => {
        this.errorMessage = 'Failed to load visits. Please try again later.';
        console.error('Error fetching visits:', error);
      },
    });

    // Fetch the initial visits
    this.visitsService.updateVisits();
  }

  createVisitForm(visit: any): FormGroup {
    return this.fb.group({
      _id: [visit._id, Validators.required], // Ensure _id is correctly set
      date: [visit.date, Validators.required],
      description: [visit.description, Validators.required],
      endTime: [visit.endTime, Validators.required],
      medicUid: [visit.medicUid, Validators.required],
      paid: [visit.paid, Validators.required],
      patientUid: [visit.patientUid, Validators.required],
      startTime: [visit.startTime, Validators.required],
      status: [visit.status, Validators.required],
      type: [visit.type, Validators.required],
    });
  }

  editVisit(index: number): void {
    this.editIndex = index; // Set the edit index
  }

  saveVisit(index: number): void {
    const updatedVisit = this.visitForms[index].value;
    const visitId = updatedVisit._id; // Extract the _id from the form

    delete updatedVisit._id;

    this.visitsService.updateVisit(visitId, updatedVisit).subscribe({
      next: () => {
        this.editIndex = null; // Reset the edit index
      },
      error: (error) => {
        console.error('Error updating visit:', error);
      },
    });
  }

  deleteVisit(index: number): void {
    const visitId = this.visitForms[index].value._id; // Extract the _id from the form

    this.visitsService.deleteVisit(visitId).subscribe({
      next: () => {
        console.log('Visit deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting visit:', error);
        this.errorMessage = 'Failed to delete visit.';
      },
    });
  }

  saveNewVisit(): void {
    if (this.newVisitForm.valid) {
      const newVisit = this.newVisitForm.value;
      this.visitsService.createVisit(newVisit).subscribe({
        next: () => {
          console.log('Visit created successfully');
          this.isCreating = false;
        },
        error: (error) => {
          console.error('Error creating visit:', error);
          this.errorMessage = 'Failed to create visit.';
        },
      });
    }
  }

  cancelEdit(): void {
    this.editIndex = null;
  }

  createNewVisit(): void {
    this.isCreating = true;
  }

  cancelCreate(): void {
    this.isCreating = false;
  }
}
