import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://localhost:5000/api/comments';
  private socket: Socket;
  private commentsSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    console.log('CommentsService initialized');

    // Initialize the socket connection
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],  // Fallback transports
      withCredentials: true,                  // Ensure credentials are passed
    });

    // Listen for comment changes from the server
    this.socket.on('commentChange', (change) => {
      console.log('Comment change detected from server:', change);
      this.updateComments();  // Fetch the updated comments from the server
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

   get currentComments() {
      console.log('Fetching current comments');
      return this.commentsSubject.asObservable();
   }

   updateComments() {
      console.log('Fetching updated comments');
      this.getComments().subscribe({
        next: (comments: any[]) => {
          console.log('Updated comments received:', comments);
          this.commentsSubject.next(comments);
        },
        error: (error) => {
          console.error('Failed to fetch updated comments:', error);
        },
      });
   }

    getComments() {
        return this.http.get<any[]>(this.apiUrl);
    }

    getComment(id: string) {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createComment(comment: any) {
        return this.http.post<any>(this.apiUrl, comment);
    }

    updateComment(id: string, comment: any) {
        return this.http.put<any>(`${this.apiUrl}/${id}`, comment);
    }

    deleteComment(id: string) {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
