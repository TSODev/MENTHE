import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { User } from '../_models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class UserService {


    constructor(private http: HttpClient) { }

    getAllUsers() {
        return this.http.get<User[]>(environment.APIEndpoint + '/api/v1/users')
            .pipe(map(resp => resp['users'])) as Observable<User[]>;
    }


    getUserById(id: string) {
        return this.http.get<User>(environment.APIEndpoint + '/api/v1/user/' + id)
        .pipe(map(resp => resp['user'])) as Observable<User>;
    }

    getUserByEmail(email: string) {
      return this.http.get<User>(environment.APIEndpoint + '/api/v1/user/email/' + email)
        .pipe(map(resp => resp['user'])) as Observable<User>;
    }

    getCurrentUser() {
        return this.http.get<User>(environment.APIEndpoint + '/api/v1/user')
            .pipe(map(resp => resp['user'])) as Observable<User>;
    }

    register(user: User) {
        return this.http.post(environment.APIEndpoint + '/api/v1/signup', user) as Observable<User>;
    }

    update(user: User) {
        return this.http.put(environment.APIEndpoint + '/api/v1/users/' + user.user_id, user);
    }

    delete(id: string) {
        return this.http.delete(environment.APIEndpoint + '/api/v1/user/' + id, {
            observe: 'response',
            responseType: 'text'
        })
        .pipe(map(response => {
            return response;
        }));
    }
}
