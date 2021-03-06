import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: User;

  subs = new SubSink();

  constructor(private userService: UserService) {

  }

  ngOnInit() {
    // this.subs.add(
    //   this.userService.getCurrentUser().subscribe(user => {
    //     this.currentUser = user;
    //   })
    // );
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
