import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models';
import { UserService, AlertService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @Input()
    theUser: User;

  isNotAdmin = true;

//    isNotAdmin: boolean = (_.intersection(this.theUser.roles, ['ADMIN']).lenght > 0);

  constructor(
    private userService: UserService,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isNotAdmin = ((_.intersection(this.theUser.roles, ['ADMIN'])).length === 0);
  }

   OnUserDelete(email: string) {
     console.log('Deleting : ', email);
     this.userService.getUserByEmail(email).subscribe(
       user => {
         console.log(user);
         this.userService.delete(user.user_id).subscribe(
           result => {
             this.alert.success('User deleted !');
//             this.router.navigate(['/Accountadmin']);
           },
           error => this.alert.error(error)
         );
       },
       error => this.alert.error(error)
     );
   }
}
