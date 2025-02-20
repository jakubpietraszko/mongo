import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private apiUrl = 'http://localhost:5000/api/patients';
  private socket: Socket;
  private patientsSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    console.log('PatientsService initialized');

    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.socket.on('patientChange', (change) => {
      console.log('Patient change detected from server:', change);
      this.updatePatients();
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

   get currentPatients() {
      console.log('Fetching current patients');
      return this.patientsSubject.asObservable();
   }

   updatePatients() {
      console.log('Fetching updated patients');
      this.getPatients().subscribe({
        next: (patients: any[]) => {
          console.log('Updated patients received:', patients);
          this.patientsSubject.next(patients);
        },
        error: (error) => {
          console.error('Failed to fetch updated patients:', error);
        },
      });
   }

   getPatients() {
      return this.http.get<any[]>(this.apiUrl);
   }

   getPacient(id: string) {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
   }

   createPatient(patient: any) {
      return this.http.post<any>(this.apiUrl, patient);
   }

   updatePatient(id: string, patient: any) {
      return this.http.put<any>(`${this.apiUrl}/${id}`, patient);
   }

    deletePatient(id: string) {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
