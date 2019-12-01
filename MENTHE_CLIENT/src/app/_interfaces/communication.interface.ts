export interface Message {
  object: object;
  type: string;
  processId?: string;
}

// export enum MenthePhase {
//   ANALYSIS = 'ANALYSIS',
//   PUBLISH = 'PUBLISH',
// }

// export enum MentheStep {
//   START = 'START',
//   PROCESSSTART = 'PROCESSSTART',
//   PARTICIPANTSTART= 'PARTICIPANTSTART',
//   DONE = 'DONE',
//   END = 'END',
// }

// export interface EmitEvent {
//   phase: MenthePhase;
//   step: MentheStep;
// }
export enum Module {
  COMMUNICATION = 'COMMUNICATION',
  ANALYSIS = 'ANALYSIS',
  PUBLISH = 'PUBLISH',
}

export interface CommunicationObject {
  object: any;
  relatedToId?: string;
}

export interface CommunicationMessage {
  header: string;
  module: Module;
  commObject: CommunicationObject;
}

export enum CommunicationMessageHeader {
//  STARTANALYSIS = 'STARTANALYSIS',
  COMMUNICATION = 'COMMUNICATION',
}

