import {
              Collaboration,
              Process,
              Participant,
              Task,
              GenericGateway,
              SequenceFlow,
              ComplexGateway,
              ExclusiveGateway,
              InclusiveGateway,
              EventBasedGateway,
              ParallelGateway
          } from '../_models/bpmn';
import { Workflow } from '../_models/workflow';

export enum ListOfElement {
  COLLECTION = 'coll',
  PROCESS = 'proc',
  PARTICIPANT = 'part',
  TASK = 'task',
  GATEWAYE = 'gate',
  FLOW = 'flow',
  WORKFLOW = 'wf',
}

export interface ElementList {
  coll: Collaboration[];
  proc: Process[];
  part: Participant[];
  task: Task[];
  gate: GenericGateway[];
  flow: SequenceFlow[];
  wf: Workflow;
}

export interface ElementListCount {
  name: string;
  count: number;
}

export enum AnalysisMessagesHeaders {
  ENTRY = 'ENTRY',
  STARTANALYSIS = 'STARTANALYSIS',
  WORKFLOW = 'WORKFLOW',
  COLLABORATION = 'COLLABORATION',
  PROCESS = 'PROCESS',
  PARTICIPANT = 'PARTICIPANT',
  STARTEVENT = 'STARTEVENT',
  ENDEVENT = 'ENDEVENT',
  TASK = 'TASK',
  STANDARD = 'STANDARD',
  SENDTASK = 'SENDTASK',
  RECEIVETASK = 'RECEIVETASK',
  USERTASK = 'USERTASK',
  MANUALTASK = 'MANUALTASK',
  SCRIPTTASK = 'SCRIPTTASK',
  SERVICETASK = 'SERVICETASK',
  BUSINESSTASK = 'BUSINESSTASK',
  CALLACTIVITY = 'CALLACTIVITY',
  EVENTBASEDTASK = 'EVENTBASEDTASK',
  COMPLEXGATEWAY = 'COMPLEXGATEWAY',
  EXCLUSIVEGATEWAY = 'EXCLUSIVEGATEWAY',
  INCLUSIVEGATEWAY = 'INCLUSIVEGATEWAY',
  EVENTBASEDGATEWAY = 'EVENTBASEDGATEWAY',
  PARALLELGATEWAY = 'PARALLELGATEWAY',
  SEQUENCEFLOW = 'SEQUENCEFLOW',
  ENDANALYSIS = 'ENDANALYSIS',
}


export interface Message {
  object: object;
  type: string;
  processId?: string;
}

export enum MenthePhase {
  ANALYSIS = 'ANALYSIS',
  PUBLISH = 'PUBLISH',
}

export enum MentheStep {
  START,
  PARTICIPANT,
  STARTEVENT,
  END,
}

export interface EmitEvent {
  phase: MenthePhase;
  step: MentheStep;
}

