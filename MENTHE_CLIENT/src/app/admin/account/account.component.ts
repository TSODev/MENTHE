import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @Input()
    theUser: User;

  constructor() { }

  ngOnInit() {
  }

}
