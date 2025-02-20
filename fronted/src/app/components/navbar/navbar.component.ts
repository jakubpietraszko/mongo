import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: any;
  currentUserSubscription!: Subscription;

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      console.log(user); // Log the current user to check its structure
      this.currentUser = user;
    });
  }
  

  ngOnDestroy() {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);

  }
}
