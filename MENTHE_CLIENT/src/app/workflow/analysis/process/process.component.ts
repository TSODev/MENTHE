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
          TaskTypeEnumerated} from 'src/app/_models/bpmn';
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
    hasParticipant = false;
    hasGateway = false;
    masterTask: MasterTask[] = [];

  subs = new SubSink();

  constructor(
    private workflowService: WorkflowService,
  ) {}

  ngOnInit() {
//    console.log('Init Process', this.hasParticipant, this.participants);
    this.workflowService.announceNewProcess(this.process);
    this.participants = this.workflowService.getElementAsArray(this.collaboration.participant);
    this.participants = this.workflowService.ListParticipantsInProcess(this.participants, this.process);
    this.participants.forEach(data => this.workflowService.announceNewParticipant(data));
    this.hasParticipant = (this.participants.length > 0);

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

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
