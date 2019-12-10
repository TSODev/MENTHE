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
  STARTANALYSIS = 'STARTANALYSIS',
  WORKFLOW = 'WORKFLOW',
  COLLABORATION = 'COLLABORATION',
  PROCESS = 'PROCESS',
  PARTICIPANT = 'PARTICIPANT',
  STARTEVENT = 'STARTEVENT',
  ENDEVENT = 'ENDEVENT',
  TASK = 'TASK',
  STANDARD = 'STANDARD',
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  USER = 'USER',
  MANUAL = 'MANUAL',
  SCRIPT = 'SCRIPT',
  SERVICE = 'SERVICE',
  BUSINESS = 'BUSINESS',
  CALLACTIVITY = 'CALLACTIVITY',
  COMPLEX = 'COMPLEX',
  EXCLUSIVE = 'EXCLUSIVE',
  INCLUSIVE = 'INCLUSIVE',
  EVENTBASED = 'EVENTBASE',
  PARALLEL = 'PARALLEL',
  FLOW = 'FLOW',
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

