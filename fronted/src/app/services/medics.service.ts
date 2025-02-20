import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MedicsService {
  private apiUrl = 'http://localhost:5000/api/medics';
  private socket: Socket;
  private medicsSubject = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient
  ) {
    console.log('MedicsService initialized');

    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.socket.on('medicChange', (change) => {
      console.log('Medic change detected from server:', change);
      this.updateMedics();
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

   get currentMedics() {
      console.log('Fetching current medics');
      return this.medicsSubject.asObservable();
   }

    updateMedics() {
        console.log('Fetching updated medics');
        this.getMedics().subscribe({
          next: (medics: any[]) => {
            console.log('Updated medics received:', medics);
            this.medicsSubject.next(medics);
          },
          error: (error) => {
            console.error('Failed to fetch updated medics:', error);
          }
        });
    }

    getMedics() {
      return this.http.get<any[]>(this.apiUrl);
    }

    getMedic(id: string) {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createMedic(medic: any) {
      return this.http.post<any>(this.apiUrl, medic);
    }

    updateMedic(id: string, medic: any) {
      return this.http.put<any>(`${this.apiUrl}/${id}`, medic);
    }

    deleteMedic(id: string) {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
