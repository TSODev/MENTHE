import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../_services';
import { User } from '../../_models';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;
    isAuthenticated: boolean;
    loggedUser: User;
    url: string;

    constructor(private authService: AuthenticationService,
                private router: Router,
                private cookieService: CookieService) {

    }

    ngOnInit() {
      console.log('Nav Component');
      this.loggedUser = JSON.parse(localStorage.getItem('currentUser'));
      this.authService.IsUserAuthenticated().subscribe(value => {
        this.isAuthenticated = value;
      });
    }

    logout() {
      const xsrftoken = this.cookieService.get('XSRF-TOKEN');
      this.authService.logout(xsrftoken).subscribe();
      this.router.navigate(['/login']);
    }
}
