import { Component } from '@angular/core';
import { ManageCommentsComponent } from '../manage-comments/manage-comments.component';
import { ManageMedicsComponent } from '../manage-medics/manage-medics.component';
import { ManagePatientsComponent } from '../manage-patients/manage-patients.component';
import { ManageRatingsComponent } from '../manage-ratings/manage-ratings.component';
import { ManageVisitsComponent } from '../manage-visits/manage-visits.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-db',
  imports: [
    ManageCommentsComponent,
    ManageMedicsComponent,
    ManagePatientsComponent,
    ManageRatingsComponent,
    ManageVisitsComponent,
    ManageUsersComponent,
    CommonModule
  ],
  standalone: true,
  templateUrl: './manage-db.component.html',
  styleUrl: './manage-db.component.css'
})
export class ManageDbComponent {
  selectedPane: string = 'users';//users, medics, patients, comments, ratings, visits
  popupMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {}

  selectPane(pane: string) {
    this.selectedPane = pane;
  }

  onChildMessage(message: string) {
    console.log('Message from child component:', message);
    this.showPopup(message);
  }

  showPopup(message: string) {
    this.popupMessage = message;

    // Automatically hide the popup after 3 seconds
    setTimeout(() => {
      this.closePopup();
    }, 3000);

    // Detect clicks outside the popup
    this.renderer.listen(this.elRef.nativeElement, 'click', (event) => {
      const popupElement = document.querySelector('.popup');
      const popupContentElement = document.querySelector('.popup-content');
      if (popupElement && !popupContentElement?.contains(event.target)) {
        this.closePopup();
      }
    });
  }

  // Close the popup
  closePopup() {
    this.popupMessage = null;
  }
}
