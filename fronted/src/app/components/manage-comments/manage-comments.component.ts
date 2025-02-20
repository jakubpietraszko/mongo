import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-comments',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './manage-comments.component.html',
  styleUrl: './manage-comments.component.css'
})
export class ManageCommentsComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<string>();

  comments: any[] = [];
  errorMessage = '';
  commentForms: FormGroup[] = [];
  editIndex: number | null = null;
  isCreating: boolean = false;
  newCommentForm: FormGroup;



  constructor(private commentsService: CommentsService,
              private fb: FormBuilder) {
    this.newCommentForm = this.fb.group({
      patientUid: ['', Validators.required],
      medicUid: ['', Validators.required],
      text: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      medic: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Subscribing to currentComments');

    this.commentsService.currentComments.subscribe({
      next: (data: any[]) => {
        this.comments = data;
        this.commentForms = data.map((comment: any) => this.createCommentForm(comment));
      },
      error: (error) => {
        this.errorMessage = 'Failed to load comments. Please try again later.';
        console.error('Error fetching comments:', error);
      },
    });

    this.commentsService.updateComments();
  }

  createCommentForm(comment: any): FormGroup {
    return this.fb.group({
      _id: [comment._id, Validators.required],
      patientUid: [comment.patientUid, Validators.required],
      medicUid: [comment.medicUid, Validators.required],
      text: [comment.text, Validators.required],
      date: [comment.date, Validators.required],
      time: [comment.time, Validators.required],
      medic: [comment.medic, Validators.required]
    });
  }

  editComment(index: number): void {
    this.editIndex = index;
  }

  saveComment(index: number): void {
    const updatedComment = this.commentForms[index].value;
    const commentId = updatedComment._id;
    delete updatedComment._id;

    this.commentsService.updateComment(commentId, updatedComment).subscribe({
      next: () => {
        console.log('Comment updated successfully');
        this.editIndex = null;
      },
      error: (error) => {
        console.error('Error updating comment:', error);
      },
    });
  }

  deleteComment(index: number): void {
    const commentId = this.commentForms[index].value._id;
    this.commentsService.deleteComment(commentId).subscribe({
      next: () => {
        console.log('Comment deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
      },
    });

  }

  saveNewComment(): void {
    if(this.newCommentForm.valid) {
      console.log('new comment form is valid');
      const newComment = this.newCommentForm.value;
      this.commentsService.createComment(newComment).subscribe({
        next: () => {
          console.log('Comment created successfully');
          this.isCreating = false;
        },
        error: (error) => {
          console.error('Error creating comment:', error);
        },
      });
    }
  }

  cancelEdit(): void {
    this.editIndex = null;
  }

  createNewComment(): void {
    this.isCreating = true;
  }

  cancelCreate(): void {
    this.isCreating = false;
  }

}
