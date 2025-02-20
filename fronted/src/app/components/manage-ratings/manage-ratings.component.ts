import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RatingsService } from '../../services/ratings.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-ratings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './manage-ratings.component.html',
  styleUrls: ['./manage-ratings.component.css']
})
export class ManageRatingsComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<string>();

  ratings: any[] = []; // Holds the ratings data
  errorMessage = ''; // Holds error messages, if any
  ratingForms: FormGroup[] = [];
  editIndex: number | null = null;  // To track which rating is being edited
  isCreating: boolean = false;
  newRatingForm: FormGroup;

  constructor(private ratingsService: RatingsService,
              private fb: FormBuilder) {

    this.newRatingForm = this.fb.group({
      patientUid: ['', Validators.required],
      medicUid: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject for real-time updates

    console.log('Subscribing to currentRatings');

    this.ratingsService.currentRatings.subscribe({
      next: (data: any[]) => {
        this.ratings = data;
        this.ratingForms = data.map((rating: any) => this.createRatingForm(rating));
      },
      error: (error) => {
        this.errorMessage = 'Failed to load ratings. Please try again later.';
        console.error('Error fetching ratings:', error);
      },
    });

    // Fetch the initial ratings
    this.ratingsService.updateRatings();
  }

  // Create a form for editing a rating
  createRatingForm(rating: any): FormGroup {
    return this.fb.group({
      _id: [rating._id, Validators.required],  // Ensure _id is correctly set
      patientUid: [rating.patientUid, Validators.required],
      medicUid: [rating.medicUid, Validators.required],
      rating: [rating.rating, Validators.required],
    });
  }

  editRating(index: number): void {
    this.editIndex = index;  // Set the edit index
  }

  // Save updated rating
  saveRating(index: number): void {
    const updatedRating = this.ratingForms[index].value;
    const ratingId = updatedRating._id;  // Extract the _id from the form

    delete updatedRating._id;

    this.ratingsService.updateRating(ratingId, updatedRating).subscribe({
      next: () => {
        console.log('Rating updated successfully');
        this.editIndex = null; // Reset edit mode
      },
      error: (error) => {
        console.error('Error updating rating:', error);
        this.errorMessage = 'Failed to save rating.';
      },
    })
  }

  deleteRating(index: number): void {
    const ratingId = this.ratingForms[index].value._id;  // Extract the _id from the form

    this.ratingsService.deleteRating(ratingId).subscribe({
      next: () => {
        console.log('Rating deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting rating:', error);
        this.errorMessage = 'Failed to delete rating.';
      },
    });
  }

  saveNewRating(): void {
    if (this.newRatingForm.valid) {
      console.log('New rating form is valid');
      const newRating = this.newRatingForm.value;
      console.log('New rating:', newRating);

      this.ratingsService.createRating(newRating).subscribe({
        next: () => {
          console.log('Rating created successfully');
          this.isCreating = false;  // Hide the form
        },
        error: (error) => {
          console.error('Error creating rating:', error);
          this.errorMessage = 'Failed to create rating.';
        },
      })
    }
  }

  // Cancel the edit
  cancelEdit(): void {
    this.editIndex = null;  // Reset the edit index to cancel editing
  }

  createNewRating(): void {
    this.isCreating = true;  // Show the form
  }

  cancelCreate(): void {
    this.isCreating = false;  // Hide the form
  }
}
