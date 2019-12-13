import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { DBProcess } from '../_models/process';
import { map, partition } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../_models/user';
import { Publication } from '../_interfaces/publish.interface';


@Injectable()
export class DBProcessService {

  private newElementSource = new Subject();
  newElementAnnounced = this.newElementSource.asObservable();


  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

// Data Manipulation

  getAllDBProcess() {
    console.log('Get All DBProcess');
    return this.http.get<DBProcess[]>(environment.APIEndpoint + '/api/v1/processes')
      .pipe(map(resp => resp['processes'])) as Observable<DBProcess[]>;
  }


  getDBProcessById(id: string) {
    return this.http.get<DBProcess>(environment.APIEndpoint + '/api/v1/process/' + id)
      .pipe(map(resp => resp['process'])) as unknown as Observable<DBProcess>;
  }

  create(process: DBProcess) {
    //        console.log('Updating : ', process);
    return this.http.post(environment.APIEndpoint + '/api/v1/process/' + process.processId, process, {
      observe: 'response',
      responseType: 'text'
    }) as unknown as Observable<DBProcess>;
  }

  update(process: DBProcess) {
    return this.http.patch(environment.APIEndpoint + '/api/v1/process/' + process.processId, process, {
      observe: 'response',
      responseType: 'text'
    }) as unknown as Observable<DBProcess>;
  }

  delete(id: string) {
    return this.http.delete(environment.APIEndpoint + '/api/v1/process/' + id, {
      observe: 'response',
      responseType: 'text'
    })
      .pipe(map(response => {
        console.log(response);
        return response;
      }));
  }

  insertOwner(id: string, owner: User) {
    return this.http.put(environment.APIEndpoint + '/api/v1/process/owner' + id, owner, {
      observe: 'response',
      responseType: 'text'
    })
      .pipe(map(response => {
        console.log(response);
        return response;
      }));
  }

}
