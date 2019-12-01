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

export interface ElementList {
  coll: Collaboration[];
  proc: Process[];
  part: Participant[];
  task: Task[];
  gate: GenericGateway[];
  flow: SequenceFlow[];
  // compgate: ComplexGateway[];
  // exclgate: ExclusiveGateway[];
  // inclgate: InclusiveGateway[];
  // evengate: EventBasedGateway[];
  // paragate: ParallelGateway[];
}

export enum AnalysisMessagesHeaders {
  STARTANALYSIS = 'STARTANALYSIS',
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
  END,
}

export interface EmitEvent {
  phase: MenthePhase;
  step: MentheStep;
}

