import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { User } from '../_models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';




export const ANONYMOUS_USER: User = {
    user_id: undefined,
    email: '',
    firstName: 'anonymous',
    lastName: 'anonymous'
};

@Injectable()
export class AuthenticationService {

    protected authenticatedUser = new BehaviorSubject<User>(ANONYMOUS_USER);
    protected isUserAuthenticated = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) { }

    signup(user: User) {
        return this.http.post(environment.APIEndpoint + '/api/v1/signup', user);
    }

    login(email: string, password: string): Observable<User> {

        let loggedUser = ANONYMOUS_USER;

        return this.http.post<HttpResponse<User>>(environment.APIEndpoint + '/api/v1/login',
                    { email, password },
                    )
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                if (response) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.isUserAuthenticated.next(true);
                    localStorage.setItem('currentUser', JSON.stringify(response));
//                    loggedUser = ({
//                        user_id: response['user_id'],
//                        email: response['email'],
//                        firstName: response['firstname'],
//                        lastName: response['lastname']
//                    }) as User;
                    loggedUser = response as unknown as User;
                    this.authenticatedUser.next(loggedUser);
                }
                return loggedUser;
            }));
    }

    logout(xsrftoken: string): Observable<any> {

        const headers = new HttpHeaders({
            'x-xsrf-token': xsrftoken });
        const options = { headers };

        // remove user from local storage to log user out
        return this.http.post<HttpResponse<any>>(environment.APIEndpoint + '/api/v1/logout', null, options)
            .pipe(
                map(response => {
                    this.isUserAuthenticated.next(false);
                    this.authenticatedUser.next(ANONYMOUS_USER);
                    localStorage.removeItem('currentUser');
                    return response;
                })
            );


    }

    getAuthenticatedUser(): Observable<User> {
        return this.authenticatedUser;
      }

    IsUserAuthenticated(): Observable<boolean> {
        return this.isUserAuthenticated;
    }

}
