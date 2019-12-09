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


  public collaborationList: Collaboration[] = [];
  private processList: Process[] = [];
  private startEventList: StartEvent[] = [];
  private endEventList: EndEvent[] = [];
  private participantList: Participant[] = [];
  private taskList: MasterTask[] = [];
  private gatewayList: GenericGateway[] = [];
  private flowList: SequenceFlow[] = [];
  private WorkFlow: Workflow = new Workflow();

  public ElementList = {
    coll: this.collaborationList,
    start: this.startEventList,
    end: this.endEventList,
    proc: this.processList,
    part: this.participantList,
    task: this.taskList,
    gate: this.gatewayList,
    flow: this.flowList,
    wf: this.WorkFlow,
  };

  private subs = new SubSink();


  constructor() {
  }

  closeService() {
    this.subs.unsubscribe();
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

  getLinkedFlow(searchedflow: string, flows: SequenceFlow[]): SequenceFlow[] {

    const flowfound = flows.filter(o => o.attr.id === searchedflow);
    return flowfound as unknown as SequenceFlow[];
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
    this.ElementList = { coll: [], proc: [], part: [], task: [], gate: [], flow: [], start: [], end: [], wf: new Workflow() };
  }


  addCollaborationInList(data) {
    this.ElementList.coll.push(data as Collaboration);
  }

  addProcessInList(data: Process, name: string) {
//    data.attr.id = name.concat('_').concat(data.attr.id);
    this.ElementList.proc.push(data);
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
//    let master: MasterTask = {attr: {id: '', name: ''}, type: TaskTypeEnumerated.STANDARD, incoming: '', outgoing: '', processId: ''};
    let master: MasterTask ;

    master = data;
    master.type = taskType;
    if (typeof processId !== 'undefined') {
      master.processId = processId;
    }

    this.ElementList.task.push(master);
  }

  addGatewayInList(type: GatewayTypeFamily, data: GenericGateway, processId?: string) {
    if (typeof processId !== 'undefined') {
      data.processId = processId;
    }
    data.type = type;
    this.ElementList.gate.push(data);
  }

  addFlowInList(data: SequenceFlow) {
    if (typeof data.attr.name === 'undefined' || data.attr.name === '') {
      data.attr.name = 'from : '.concat(data.attr.sourceRef.concat(' to : ', data.attr.targetRef));
    }
    data.attr.alias = data.attr.name;
    data.attr.mappedTo = null;
    this.ElementList.flow.push(data as SequenceFlow);
  }

  addWorkFlowInList(data: Workflow) {
    this.ElementList.wf = data;
  }

}
