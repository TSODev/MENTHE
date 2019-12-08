import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-userboard',
  templateUrl: './userboard.component.html',
  styleUrls: ['./userboard.component.css']
})
export class UserBoardComponent implements OnInit {

  subs = new SubSink();
  boardForm: FormGroup;
  users: User[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
      this.userService.getAllUsers().subscribe(data => this.users = data);
  }

  ngOnInit() {
    this.boardForm = this.formBuilder.group({
      filter: ['']
    });
  }

  onDelete(event) {
    this.users = this.users.filter(u => u.user_id !== event.user_id);
  }

}
