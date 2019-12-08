import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { UserService, AlertService } from '../../_services';
import { User } from '../../_models';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-accountadmin',
  templateUrl: './accountadmin.component.html',
  styleUrls: ['./accountadmin.component.css']
})
export class AccountadminComponent implements OnInit, OnDestroy {

  @Input()
  user: User;

  @Output()
  userDeleted = new EventEmitter();

//  users: User[];
  subs = new SubSink();
  Admin = false;

  constructor(
    private userService: UserService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
//    this.loadUsers();
    this.Admin = this.isAdmin(this.user);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  isAdmin(user: User) {
    return ((_.intersection(user.roles, ['ADMIN'])).length > 0);
  }

  OnUserDelete(user: User) {
    this.subs.add(
      this.userService.getUserByEmail(user.email).subscribe(
      me => {
        this.userService.delete(me.user_id).subscribe(
          result => {
            this.alert.success('User deleted !');
            this.userDeleted.emit(me);
          },
          error => this.alert.error(error)
        );
      },
      error => this.alert.error(error)
    )
    );
  }

  editUser() {

  }

  doNothing() {

  }
}
