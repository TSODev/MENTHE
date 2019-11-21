﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Workflow } from '../_models/workflow';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from './user.service';


@Injectable()
export class WorkflowService {


    constructor(
      private http: HttpClient,
      private userService: UserService
      ) { }

    getAllWorkflow() {
        console.log('Get All Workflow');
        return this.http.get<Workflow[]>(environment.APIEndpoint + '/api/v1/workflows')
            .pipe(map(resp => resp['workflows'])) as Observable<Workflow[]>;
    }


    getWorkflowById(id: string) {
        return this.http.get<Workflow>(environment.APIEndpoint + '/api/v1/workflow/' + id)
        .pipe(map(resp => resp['workflow'])) as Observable<Workflow>;
    }

    create(workflow: Workflow) {
      //        console.log('Updating : ', workflow);
              return this.http.post(environment.APIEndpoint + '/api/v1/workflow/' + workflow.workflow_id, workflow, {
                observe: 'response',
                responseType: 'text'
              }) as unknown as Observable<Workflow>;
          }

    update(workflow: Workflow) {
//        console.log('Updating : ', workflow);

        // workflow.lastModifiedDate = new Date();
        // const sub = this.userService.getCurrentUser().subscribe( user => {
        //   console.log('Updated by :', user);
        //   workflow.lastModifiedBy = user.firstname.concat(' ', user.lastname);

        //        });
        return this.http.patch(environment.APIEndpoint + '/api/v1/workflow/' + workflow.workflow_id, workflow, {
          observe: 'response',
          responseType: 'text'
        }) as unknown as Observable<Workflow>;
    }

    delete(id: string) {
        return this.http.delete(environment.APIEndpoint + '/api/v1/workflow/' + id, {
            observe: 'response',
            responseType: 'text'
        })
        .pipe(map(response => {
            return response;
        }));
    }

    getImage(id: string) {
      this.getWorkflowById(id).subscribe(
        wf => {
          return wf.image;
        }
      );
    }
}