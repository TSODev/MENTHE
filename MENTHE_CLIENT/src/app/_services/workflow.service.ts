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


@Injectable()
export class WorkflowService {

  private newParticipantSource = new Subject<Participant>();
  newParticipantAnnounced$ = this.newParticipantSource.asObservable();
  private newProcessSource = new Subject<Process>();
  newProcessAnnounced$ = this.newProcessSource.asObservable();

  private bpmnDataSource = new Subject<BpmnFile>();
  public bpmnData: BpmnFile;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  announceNewParticipant(participant: Participant) {
    console.log('[SERVICE] I have to annouce a new Participant ', participant.attr.name);
    this.newParticipantSource.next(participant);
  }

  announceNewProcess(process: Process) {
    console.log('[SERVICE] I have to annouce a new Process ', process.attr.id);
    this.newProcessSource.next(process);
  }


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



    // Utilities ...

    private isAnArray(element): boolean {
  return (element instanceof Array);
}

getElementAsArray(element): any[] {         // Test if element is an Array , then return it , Else push it in an Array
  if (typeof element === 'undefined') {
    return null;
  } else {

  let arr = [];
  if (this.isAnArray(element)) {
    arr = element as unknown as [];
  } else {
    arr.push(element);
  }
  return arr;
}
}

createMasterTypeEntry(entry: any, type: TaskTypeEnumerated): MasterTask {

  if (typeof entry === 'undefined') {
    return null;
  } else {

  const result: MasterTask = {
      type,
      attr: entry.attr,
      incoming: entry.incoming,
      outgoing: entry.outgoing
    };

  return result;
  }
}

addInMasterTaskArray( master: MasterTask[], task: GenericTask[], type: TaskTypeEnumerated) {
  let tasks: GenericTask[];
  tasks = this.getElementAsArray(task);
  if (tasks !== null) {
    tasks.forEach(data => master.push(this.createMasterTypeEntry(data, type)));
  }
}

getLinkedFlowFromSequence(flow: string): SequenceFlow {

  return null;
}
getLinkedFlow(searchedflow: string, flows: SequenceFlow[]): SequenceFlow {

  let flowfound = flows.find(o => o.attr.id === searchedflow);
  return flowfound as unknown as SequenceFlow;
}

isParticipantInProcess(participant: Participant, process: Process): boolean {
  //      console.log('P: ', participant.attr.processRef, ' P: ', process.attr.id);
  return (participant.attr.processRef === process.attr.id);
}

isThisParticipantInProcess(participant: Participant, process: Process): Observable < boolean > {
  return(participant.attr.processRef === process.attr.id) as unknown as Observable<boolean>;
}

ListParticipantsInProcess(participants: Participant[], process: Process): Participant[] {
  const partIn: Participant[] = [];
  participants.forEach(data => {
    if (data.attr.processRef === process.attr.id) {
      partIn.push(data);
    }
  })
  return partIn;
}
}
