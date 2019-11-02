import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AlertService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  data_to_display = false;

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {
    //        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.currentUser = localStorage.getItem['currentUser'];
    this.loadAllUsers();
    this.data_to_display = true;
  }

  deleteUser(event: Event, user: User) {
    if (user.user_id === this.currentUser.user_id) {
        this.alertService.error('Cannot remove myself !');
    } else {
        console.log('User :', user);
      this.userService.delete(user.user_id).subscribe(response => {
        if (response.status === 201) {
          this.alertService.success('User deleted');
          this.loadAllUsers();
        } else {
          this.alertService.error('Error in delete');
        }
      });
    }
  }

  private loadAllUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }
}
