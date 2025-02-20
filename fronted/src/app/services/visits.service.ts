import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {
  private apiUrl = 'http://localhost:5000/api/visits';
  private socket: Socket;
  private visitsSubject = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient
  ) { 
    console.log('VisitsService initialized');

    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.socket.on('visitChange', (change) => {
      console.log('Visit change detected from server:', change);
      this.updateVisits();
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    this.socket.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });

  }


  get currentVisits() {
    console.log('Fetching current visits');
    return this.visitsSubject.asObservable();
  }

  updateVisits() {
    console.log('Fetching updated visits');
    this.getVisits().subscribe({
      next: (visits: any[]) => {
        console.log('Updated visits received:', visits);
        this.visitsSubject.next(visits);
      },
      error: (error) => {
        console.error('Failed to fetch updated visits:', error);
      },
    });
  }

  getVisits() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVisit(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createVisit(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateVisit(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteVisit(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
