import { Component, OnInit, OnDestroy } from '@angular/core';
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


  users: User[];
  subs = new SubSink();

  constructor(
    private userService: UserService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  isAdmin(user: User) {
    return ((_.intersection(user.roles, ['ADMIN'])).length > 0);
  }

  OnUserDelete(email: string) {
    console.log('Deleting : ', email);
    this.subs.add(
      this.userService.getUserByEmail(email).subscribe(
      user => {
 //       console.log(user);
        this.userService.delete(user.user_id).subscribe(
          result => {
            this.alert.success('User deleted !');
            this.loadUsers();
//             this.router.navigate(['/Accountadmin']);
          },
          error => this.alert.error(error)
        );
      },
      error => this.alert.error(error)
    )
    );
  }

  loadUsers() {
    this.subs.add(
      this.userService.getAllUsers()
      .subscribe(
        users => {
          this.users = users;
        }
    )
    );
  }
}
