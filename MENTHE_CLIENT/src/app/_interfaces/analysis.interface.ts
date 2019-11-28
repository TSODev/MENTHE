import { Collaboration, Process, Participant, Task, GenericGateway, SequenceFlow, ComplexGateway, ExclusiveGateway, InclusiveGateway, EventBasedGateway, ParallelGateway } from '../_models/bpmn';

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

export interface Message {
  object: object;
  type: string;
}

export interface EmitEvent {
  step: string;
}

