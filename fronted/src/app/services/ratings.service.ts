import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  private apiUrl = 'http://localhost:5000/api/ratings';
  private socket: Socket;
  private ratingsSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    console.log('RatingsService initialized');

    // Initialize the socket connection
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],  // Fallback transports
      withCredentials: true,                  // Ensure credentials are passed
    });

    // Listen for rating changes from the server
    this.socket.on('ratingChange', (change) => {
      console.log('Rating change detected from server:', change);
      this.updateRatings();  // Fetch the updated ratings from the server
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Handle socket errors
    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
    this.socket.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });
  }

  // Observable to get the current ratings
  get currentRatings() {
    console.log('Fetching current ratings');
    return this.ratingsSubject.asObservable();
  }

  // Fetch updated ratings from the server
  updateRatings() {
    console.log('Fetching updated ratings');
    this.getRatings().subscribe({
      next: (ratings: any[]) => {
        console.log('Updated ratings received:', ratings);
        this.ratingsSubject.next(ratings);
      },
      error: (error) => {
        console.error('Error fetching updated ratings:', error);
      },
    });
  }

  // HTTP methods to interact with the API
  getRatings() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRating(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRating(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateRating(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteRating(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
