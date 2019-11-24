import { Component, OnInit, OnDestroy } from '@angular/core';

import { User } from '../../_models/user';
import { UserService, AlertService } from '../../_services';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
 })
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  users: User[] = [];
  datatodisplay = false;

  subs = new SubSink();

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {
    //        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    console.log('Home Component');
    this.subs.add(
      this.userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
      })
    );
    this.currentUser = localStorage.getItem['currentUser'];
    //    this.loadAllUsers();
    this.datatodisplay = true;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  deleteUser(event: Event, user: User) {
    if (user.user_id === this.currentUser.user_id) {
      this.alertService.error('Cannot remove myself !');
    } else {
      console.log('User :', user);
      this.userService.delete(user.user_id).subscribe(response => {
        if (response.status === 201) {
          this.alertService.success('User deleted');
          //          this.loadAllUsers();
        } else {
          this.alertService.error('Error in delete');
        }
      });
    }
  }

  // private loadAllUsers() {
  //   this.userService.getAllUsers().subscribe(users => {
  //     this.users = users;
  //   });
  // }
}
