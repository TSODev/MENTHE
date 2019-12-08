import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-userboard',
  templateUrl: './userboard.component.html',
  styleUrls: ['./userboard.component.css']
})
export class UserBoardComponent implements OnInit {

  subs = new SubSink();
  boardForm: FormGroup;
  filter = '';
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

    this.boardForm.controls.filter.valueChanges.pipe(
      debounceTime(250))
      .subscribe(data => {
          this.filter = data;
          });
  }

  onDelete(event) {
    this.users = this.users.filter(u => u.user_id !== event.user_id);
  }

}
