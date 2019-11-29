import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Workflow } from '../_models/workflow';
import {
  Participant,
  Process,
  TaskTypeEnumerated,
  MasterTask,
  GenericTask,
  SequenceFlow,
  GenericGateway,
  Collaboration,
  GatewayTypeFamily,
  StartEvent,
  EndEvent
} from '../_models/bpmn';
import { Observable } from 'rxjs/internal/Observable';
import { SubSink } from 'subsink';
import { ElementList, Message, EmitEvent } from '../_interfaces/analysis.interface';
import * as _ from 'lodash';
import * as he from 'he';


@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private newElementSource = new Subject<Message>();
  public newElementAnnounced$ = this.newElementSource.asObservable();

  private communicationSource = new Subject<EmitEvent>();
  public communication$ = this.communicationSource.asObservable();

  public collaborationList: Collaboration[] = [];
  private processList: Process[] = [];
  private startEventList: StartEvent[] = [];
  private endEventList: EndEvent[] = [];
  private participantList: Participant[] = [];
  private taskList: MasterTask[] = [];
  private gatewayList: GenericGateway[] = [];
  private flowList: SequenceFlow[] = [];

  public ElementList = {
    coll: this.collaborationList,
    start: this.startEventList,
    end: this.endEventList,
    proc: this.processList,
    part: this.participantList,
    task: this.taskList,
    gate: this.gatewayList,
    flow: this.flowList,
  };

  private subs = new SubSink();


  constructor() {
    this.subs.add(
      this.newElementAnnounced$.subscribe(
        data => {
          console.log('[ANALYSIS] : ', data.type, ' > ', data.object, '/', data.processId);
          let gate: GenericGateway;
          switch (data.type) {
            case 'Collaboration': this.addCollaborationInList(data.object);
                                  break;
            case 'Process': this.addProcessInList(data.object);
                            break;
            case 'Participant': this.addParticipantInList(data.object);
                                break;
            case 'StartEvent': this.addStartEventInList(data.object);
                               break;
            case 'EndEvent': this.addEndEventInList(data.object);
                             break;
            case 'Standard': this.addTaskInList(data.object, TaskTypeEnumerated.STANDARD, data.processId);
                             break;
            case 'Send': this.addTaskInList(data.object, TaskTypeEnumerated.SEND, data.processId);
                         break;
            case 'Receive': this.addTaskInList(data.object, TaskTypeEnumerated.RECEIVE, data.processId);
                            break;
            case 'User': this.addTaskInList(data.object, TaskTypeEnumerated.USER, data.processId);
                         break;
            case 'Service': this.addTaskInList(data.object, TaskTypeEnumerated.SERVICE, data.processId);
                            break;
            case 'Script': this.addTaskInList(data.object, TaskTypeEnumerated.SCRIPT, data.processId);
                           break;
            case 'Manual': this.addTaskInList(data.object, TaskTypeEnumerated.MANUAL, data.processId);
                           break;
            case 'CallActivity': this.addTaskInList(data.object, TaskTypeEnumerated.CALLACTIVITY, data.processId);
                                 break;
            case 'Business': this.addTaskInList(data.object, TaskTypeEnumerated.BUSINESSRULE, data.processId);
                             break;
            case 'EventBased': this.addTaskInList(data.object, TaskTypeEnumerated.EVENTBASED, data.processId);
                               break;
            case 'Complex': gate = data.object as GenericGateway;
                            gate.type = GatewayTypeFamily.COMPLEX;
                            this.addGatewayInList(gate, data.processId);
                            break;
            case 'Exclusive': gate = data.object as GenericGateway;
                              gate.type = GatewayTypeFamily.EXCLUSIVE;
                              this.addGatewayInList(gate, data.processId);
                              break;
            case 'Inclusive': gate = data.object as GenericGateway;
                              gate.type = GatewayTypeFamily.INCLUSIVE;
                              this.addGatewayInList(gate, data.processId);
                              break;
            case 'EventBased': gate = data.object as GenericGateway;
                               gate.type = GatewayTypeFamily.EVENTBASED;
                               this.addGatewayInList(gate, data.processId);
                               break;
            case 'Parallel': gate = data.object as GenericGateway;
                             gate.type = GatewayTypeFamily.PARALLEL;
                             this.addGatewayInList(gate, data.processId);
                             break;
            case 'Flow': this.addFlowInList(data.object as unknown as SequenceFlow);
                         break;
          }
          console.log('[LIST] : ', this.ElementList);
        })
    );

    this.subs.add(
      this.communication$.subscribe(
        data => {
          console.log('[COMMUNICATION]', data);
          switch (data.step) {
            case 'start': this.clearElementList();
                          break;
            case 'done': console.log('End of Analysis');
                         break;
            case 'end': break;
          }
        }
      )
    );

  }

  emit(event: EmitEvent) {
    this.communicationSource.next(event);
  }

  closeAnalysisService() {
    this.subs.unsubscribe();
  }

  announceNewElement(element: any, elementType: string, processId?: string) {
    console.log('[SERVICE] annouce a new', elementType, '  ', element);
    const message: Message = { object: element, type: elementType, processId };
    this.newElementSource.next(message);
  }

  announceNewElementArray(element: any[], elementType: string, processId?: string) {
    if (element !== null) {
      element.forEach(data => {
        console.log('[SERVICE] Annouce a new', elementType, '  ', data);
        const message: Message = { object: data, type: elementType, processId };
        this.newElementSource.next(message);
      });
    }
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
        outgoing: entry.outgoing,
        processId: '',
      };

      return result;
    }
  }

  addInMasterTaskArray(master: MasterTask[], task: GenericTask[], type: TaskTypeEnumerated) {
    let tasks: GenericTask[];
    tasks = this.getElementAsArray(task);
    if (tasks !== null) {
      tasks.forEach(data => master.push(this.createMasterTypeEntry(data, type)));
    }
  }

  getLinkedFlow(searchedflow: string, flows: SequenceFlow[]): SequenceFlow {

    const flowfound = flows.filter(o => o.attr.id === searchedflow);
    return flowfound as unknown as SequenceFlow;
  }

  getLinkedFlowFromElementList(searchflow: string) {
    //    console.log('Service : ', searchflow, ' / ' , this.ElementList.flow.filter(o => o.attr.id === searchflow));
    return (this.ElementList.flow.filter(o => o.attr.id === searchflow));
  }

  getLinkedFlowFromProcess(searchedflow: string, process: Process): SequenceFlow {
    return this.getElementAsArray(process.sequenceFlow).find(o => o.attr.id === searchedflow) as unknown as SequenceFlow;
  }

  isParticipantInProcess(participant: Participant, process: Process): boolean {
    //      console.log('P: ', participant.attr.processRef, ' P: ', process.attr.id);
    return (participant.attr.processRef === process.attr.id);
  }

  isThisParticipantInProcess(participant: Participant, process: Process): Observable<boolean> {
    return (participant.attr.processRef === process.attr.id) as unknown as Observable<boolean>;
  }

  ListParticipantsInProcess(participants: Participant[], process: Process): Participant[] {
    const partIn: Participant[] = [];
    participants.forEach(data => {
      if (data.attr.processRef === process.attr.id) {
        partIn.push(data);
      }
    });
    return partIn;
  }


  getElementList(): ElementList {
    return this.ElementList;
  }

  getParticipantList(): Participant[] {
    return this.ElementList.part;
  }

  getProcessList(): Process[] {
    return this.ElementList.proc;
  }

  getTaskList(processId: string): MasterTask[] {
    return this.ElementList.task.filter(o => o.processId === processId);
  }

  getGatewayList(gatewayType: GatewayTypeFamily, processId: string): GenericGateway[] {
    return this.ElementList.gate.filter(o => (o.type === gatewayType) && (o.processId === processId));
  }

  getFlowList(): SequenceFlow[] {
    return this.ElementList.flow;
  }

  getStartEventList(): StartEvent[] {
    return this.ElementList.start;
  }

  getEndEventList(): EndEvent[] {
    return this.ElementList.end;
  }

  clearElementList() {
    this.ElementList = { coll: [], proc: [], part: [], task: [], gate: [], flow: [], start: [], end: [] };
  }


  addCollaborationInList(data) {
    this.ElementList.coll.push(data as Collaboration);
  }

  addProcessInList(data) {
    this.ElementList.proc.push(data as Process);
  }

  addStartEventInList(data) {
    this.ElementList.start.push(data as StartEvent);
  }

  addEndEventInList(data) {
    this.ElementList.end.push(data as EndEvent);
  }

  addParticipantInList(data) {
    this.ElementList.part.push(data as Participant);
  }

  addTaskInList(data, taskType: TaskTypeEnumerated, processId?: string) {
    let master: MasterTask;
    master = data;
    master.type = taskType;
    if (typeof processId !== 'undefined') {
      master.processId = processId;
    }
    this.ElementList.task.push(master);
  }

  addGatewayInList(data: GenericGateway, processId?: string) {
    if (typeof processId !== 'undefined') {
      data.processId = processId;
    }
    this.ElementList.gate.push(data);
  }

  addFlowInList(data: SequenceFlow) {
    if (typeof data.attr.name === 'undefined' || data.attr.name === '') {
      data.attr.name = 'from : '.concat(data.attr.sourceRef.concat(' to : ', data.attr.targetRef));
    }
    this.ElementList.flow.push(data as SequenceFlow);
  }

}
