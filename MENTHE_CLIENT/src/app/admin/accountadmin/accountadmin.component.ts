import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services';
import { User } from '../../_models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-accountadmin',
  templateUrl: './accountadmin.component.html',
  styleUrls: ['./accountadmin.component.css']
})
export class AccountadminComponent implements OnInit {

  public users: User[];
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {


    this.userService.getAllUsers()
      .subscribe(
        users => {
          console.log(users);
          this.users = users;
        }
    );
  }

}
