export class Attr {

  public id: string;
  public targetNamespace: string;
  public exporter: string;
  public exporterVersion: string;

}

export class Attr_ {

  public id: string;

}

export class Attr__ {

  public id: string;
  public name: string;
  public processRef: string;

}

export class Attr___ {

  public id: string;
  public isExecutable: boolean;

}

export class Attr____ {

  public id: string;
  public name: string;

}

export class Attr_____ {

  public id: string;
  public name: string;

}
export class Attr______ {

  public id: string;
  public sourceRef: string;
  public targetRef: string;

}
export class Attr_______ {

  public id: string;
  public name: string;

}

export class Attr________ {

  public id: string

}

export class Attr_________ {

  public id: string;
  public bpmnElement: string;

}

export class Attr__________ {

  public id: string;
  public bpmnElement: string;
  public isHorizontal: boolean;

}
export class Attr___________ {

  public x: number;
  public y: number;
  public width: number;
  public height: number;

}
export class Attr____________ {

  public x: number;
  public y: number;
  public width: number;
  public height: number;

}

export class Attr_____________ {

  public id: string;
  public bpmnElement: string;

}
export class Attr______________ {

  public x: number;
  public y: number;

}

export class Attr_Message {
  public id: string;
}
export class BPMNDiagram {

  public attr: Attr________;
  public bPMNPlane: BPMNPlane;

}

//import java.util.List;

export class BPMNEdge {

  public attr: Attr_____________;
  // public List<Waypoint> waypoint = null;
  public waypoint: Waypoint[];

}
export class BPMNLabel {

  public bounds: Bounds_;

}

export class BPMNPlane {

  public attr: Attr_________;
  // public List<BPMNShape> bPMNShape = null;
  // public List<BPMNEdge> bPMNEdge = null;
  public bPMNShape: BPMNShape[];
  public bPMNEdge: BPMNEdge[];

}

export class BPMNShape {

  public attr: Attr__________;
  public bounds: Bounds;
  public bPMNLabel: BPMNLabel;

}

export class Bounds {

  public attr: Attr___________;

}

export class Bounds_ {

  public attr: Attr____________;

}

export class Collaboration {

  public attr: Attr_;
  public participant: Participant;

}

export class Message {
  public attr: Attr_Message;
}

export class Definitions {

  public attr: Attr;
  public message: Message[];
  public collaboration: Collaboration;
  public process: Process;                // can be an object or an Array of Objects;
  public processes: Process[];            // can be an object or an array of objects;
  public bPMNDiagram: BPMNDiagram;

}

export class EndEvent {

  public attr: Attr_______;
  public incoming: string;

}

export class Participant {

  public attr: Attr__;

}
//import java.util.List;

export class Process {

  public attr: Attr___;
  public startEvent: StartEvent;
  public task: Task[];
  public sendTask: SendTask[];
  public receiveTask: ReceiveTask[];
  public userTask: UserTask[];
  public manualTask: ManualTask[];
  public businessruleTask: BusinessRuleTask[];
  public serviceTask: ServiceTask[];
  public scriptTask: ScriptTask[];
  public callActivity: CallActivity[];
  //public SequenceFlow: List<SequenceFlow>;
  public SequenceFlow: SequenceFlow[];
  public endEvent: EndEvent;

}

export class SequenceFlow {
  public attr: Attr______;
}

export class StartEvent {

  public attr: Attr____;
  public outgoing: string;

}

export class GenericTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class Task {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class SendTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class ReceiveTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class UserTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class ManualTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class BusinessRuleTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class ServiceTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class ScriptTask {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export class CallActivity {

  public attr: Attr_____;
  public incoming: string;
  public outgoing: string;

}

export enum TaskTypeEnumerated {
  STANDARD = 'STANDARD',
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  USER = 'USER',
  MANUAL = 'MANUAL',
  BUSINESSRULE = 'BUSINESSRULE',
  SERVICE = 'SERVICE',
  SCRIPT= 'SCRIPT',
  CALLACTIVITY = 'CALLACTIVITY',
}

export   enum TypeFamily {
  STANDARD,
  SEND,
  RECEIVE,
  USER,
  MANUAL,
  BUSINESSRULE,
  SERVICE,
  SCRIPT,
  CALLACTIVITY,
}

export   enum TypeFamilyName {
  'STANDARD',
  'SEND',
  'RECEIVE',
  'USER',
  'MANUAL',
  'BUSINESSRULE',
  'SERVICE',
  'SCRIPT',
  'CALLACTIVITY',
}

// export class TaskType {
//   type: TypeFamily;
//   name: TypeFamilyName;
// }


export class MasterTask {

  public attr: Attr_____;
  public type: TaskTypeEnumerated;
  public incoming: string;
  public outgoing: string;

}



export class Waypoint {

  public attr: Attr______________;

}

export class BpmnFile {
  public definitions: Definitions;
}
