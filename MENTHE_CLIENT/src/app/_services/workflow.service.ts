import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Workflow } from '../_models/workflow';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class WorkflowService {


    constructor(private http: HttpClient) { }

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
}
