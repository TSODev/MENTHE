import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
                private cookieService: CookieService,
                private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 403) {
                // auto logout if Forbidden response returned from api
                const xsrftoken = this.cookieService.get('XSRF-TOKEN');
                this.authenticationService.logout(xsrftoken);
//                this.authenticationService.logout(xsrftoken).subscribe(result => console.log(result));
//                location.reload(true);
                this.router.navigate(['/disconnect']);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
