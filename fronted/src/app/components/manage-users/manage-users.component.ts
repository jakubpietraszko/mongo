import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-manage-users',
  imports: [],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  @Output() sendMessage = new EventEmitter<string>();
}
