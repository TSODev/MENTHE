import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { DBVariable } from '../_models/variable';
import { map, partition } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { Variable } from '../_interfaces/publish.interface';


@Injectable()
export class DBVariableService {

  private newElementSource = new Subject();
  newElementAnnounced = this.newElementSource.asObservable();


  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

// Data Manipulation

  getAllDBVariable() {
    console.log('Get All Variable');
    return this.http.get<Variable[]>(environment.APIEndpoint + '/api/v1/variables')
      .pipe(map(resp => resp['variables'])) as Observable<Variable[]>;
  }


  getDBVariableById(id: string) {
    return this.http.get<Variable>(environment.APIEndpoint + '/api/v1/variable/' + id)
      .pipe(map(resp => resp['variable'])) as unknown as Observable<Variable>;
  }

  getDBVariableByWorkFlowId(id: string) {
    return this.http.get<Variable>(environment.APIEndpoint + '/api/v1/variable/workflow/' + id)
      .pipe(map(resp => resp['variable'])) as unknown as Observable<Variable>;
  }


  create(variable: Variable) {
    //        console.log('Updating : ', variable);
    return this.http.post(environment.APIEndpoint + '/api/v1/variable/' + variable.variableId, variable, {
      observe: 'response',
      responseType: 'text'
    }) as unknown as Observable<Variable>;
  }

  update(variable: Variable) {
    return this.http.patch(environment.APIEndpoint + '/api/v1/variable/' + variable.variableId, variable, {
      observe: 'response',
      responseType: 'text'
    }) as unknown as Observable<Variable>;
  }

  delete(id: string) {
    return this.http.delete(environment.APIEndpoint + '/api/v1/variable/' + id, {
      observe: 'response',
      responseType: 'text'
    })
      .pipe(map(response => {
//        console.log(response);
        return response;
      }));
  }


}
