import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Workflow } from '../_models/workflow';
import { map, partition } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { Participant,
          Process,
          BpmnFile,
          TypeFamily,
          TaskTypeEnumerated,
          MasterTask,
          GenericTask,
          SequenceFlow} from '../_models/bpmn';
import * as parser from 'fast-xml-parser';
import * as he from 'he';


@Injectable()
export class WorkflowService {

  private newElementSource = new Subject();
  newElementAnnounced = this.newElementSource.asObservable();

  // private newParticipantSource = new Subject<Participant>();
  // newParticipantAnnounced$ = this.newParticipantSource.asObservable();
  // private newProcessSource = new Subject<Process>();
  // newProcessAnnounced$ = this.newProcessSource.asObservable();
  // private newFlowSource = new Subject<SequenceFlow>();
  // newFlowAnnounced$ = this.newFlowSource.asObservable();

  public bpmnData: BpmnFile;


  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

// Data Manipulation

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
        console.log(response);
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

  getBPMNData(wf: Workflow): BpmnFile {

    const options = {
      attributeNamePrefix: '',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: true,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
      tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
      stopNodes: ['BPMNDiagram'],
    };


//    this.bpmnData$ = {};
    if (parser.validate(wf.xmlcontent) === true) {
      this.bpmnData = parser.parse(wf.xmlcontent, options);
    } else {
      console.log('XML parsing failure...');
    }
    return this.bpmnData;
  }



}
