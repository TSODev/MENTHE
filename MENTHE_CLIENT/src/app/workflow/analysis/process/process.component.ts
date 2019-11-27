import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TypeFamily,
          Process,
          Participant,
          Collaboration,
          Task,
          MasterTask,
          SendTask,
          ReceiveTask,
          UserTask,
          ManualTask,
          BusinessRuleTask,
          ServiceTask,
          ScriptTask,
          CallActivity,
          TaskTypeEnumerated,
          ComplexGateway,
          EventBasedGateway,
          ExclusiveGateway,
          InclusiveGateway,
          ParallelGateway} from 'src/app/_models/bpmn';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit, OnDestroy {

  @Input()
    process: Process;
  @Input()
    collaboration: Collaboration;
    participants: Participant[];
    complexGateways: ComplexGateway[];
    eventbasedGateways: EventBasedGateway[];
    exclusiveGateways: ExclusiveGateway[];
    inclusiveGateways: InclusiveGateway[];
    parallelGateways: ParallelGateway[];

    hasParticipant = false;
    hasStartEvent = false;
    hasEndEvent = false;
    hasComplexGateway = false;
    hasEventBasedGateway = false;
    hasExclusiveGateway = false;
    hasInclusiveGateway = false;
    hasParallelGateway = false;
    hasTask = false;

    masterTask: MasterTask[] = [];

  subs = new SubSink();

  constructor(
    private workflowService: WorkflowService,
  ) {}

  ngOnInit() {
//    console.log('Init Process', this.hasParticipant, this.participants);
    this.workflowService.announceNewProcess(this.process);
    this.hasStartEvent = (this.process.startEvent.attr.id != null);
    this.hasEndEvent = (this.process.endEvent.attr.id != null);
    this.participants = this.workflowService.getElementAsArray(this.collaboration.participant);
    this.participants = this.workflowService.ListParticipantsInProcess(this.participants, this.process);
    this.participants.forEach(data => this.workflowService.announceNewParticipant(data));
    this.hasParticipant = (this.participants.length > 0);

    this.complexGateways = this.workflowService.getElementAsArray(this.process.complexGateway);
    this.eventbasedGateways = this.workflowService.getElementAsArray(this.process.eventbasedGateway);
    this.exclusiveGateways = this.workflowService.getElementAsArray(this.process.exclusiveGateway);
    this.inclusiveGateways = this.workflowService.getElementAsArray(this.process.inclusiveGateway);
    this.parallelGateways = this.workflowService.getElementAsArray(this.process.parallelGateway);

    this.hasComplexGateway = (this.complexGateways != null);
    this.hasEventBasedGateway = (this.eventbasedGateways != null);
    this.hasExclusiveGateway = (this.exclusiveGateways != null);
    this.hasInclusiveGateway = (this.inclusiveGateways != null);
    this.hasParallelGateway = (this.parallelGateways != null);

    // Collect Tasks List

    const stdtasks: Task[] = [];
    const sendtasks: SendTask[] = [];
    const receivetasks: ReceiveTask[] = [];
    const usertasks: UserTask[] = [];
    const manualtasks: ManualTask[] = [];
    const businessruletasks: BusinessRuleTask[] = [];
    const servicetasks: ServiceTask[] = [];
    const scripttasks: ScriptTask[] = [];
    const calltasks: CallActivity[] = [];


    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.task, TaskTypeEnumerated.STANDARD);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.sendTask, TaskTypeEnumerated.SEND);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.receiveTask, TaskTypeEnumerated.RECEIVE);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.userTask, TaskTypeEnumerated.USER);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.serviceTask, TaskTypeEnumerated.SERVICE);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.scriptTask, TaskTypeEnumerated.SCRIPT);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.manualTask, TaskTypeEnumerated.MANUAL);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.businessruleTask, TaskTypeEnumerated.BUSINESSRULE);
    this.workflowService.addInMasterTaskArray(this.masterTask, this.process.callActivity, TaskTypeEnumerated.CALLACTIVITY);
    this.hasTask = (this.masterTask.length > 0 );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
