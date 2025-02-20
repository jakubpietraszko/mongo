import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
  }

  registerPatient(userData: any) {
    return this.http.post(`${this.apiUrl}/registerPatient`, userData).pipe(
      catchError((error) => {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error; // Get specific error message from the server
        }
        return throwError(errorMessage);
      })
    );
  }

  registerMedic(userData: any) {
    return this.http.post(`${this.apiUrl}/registerMedic`, userData).pipe(
      catchError((error) => {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error; // Get specific error message from the server
        }
        return throwError(errorMessage);
      })
    );
  }

  registerAdmin(userData: any) {
    console.log(userData);
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError((error) => {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error; // Get specific error message from the server
        }
        return throwError(errorMessage);
      })
    );
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error; // Get specific error message from the server
        }
        return throwError(errorMessage);
      }),
      // After successful login, we update the BehaviorSubject with the user role and other data
      tap((response: any) => {
        // Assuming 'response' contains the necessary details
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response); // Update the BehaviorSubject
      })
    );
  }

  refreshToken() {

    const json_value = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const refreshToken = json_value.refreshToken;
    return this.http
      .post(`${this.apiUrl}/token`, { refreshToken })
      .pipe(
        tap((response: any) => {

          console.log('response:', response);

          var currentUser = this.currentUserSubject.value;
          currentUser.token = response.token;

          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.currentUserSubject.next(currentUser);

          console.log('after refresh token called', localStorage.getItem('currentUser'));

        }),
        catchError((error) => throwError(error.error || 'Server Error'))
      )
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }
}
