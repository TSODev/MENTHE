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
          ParallelGateway,
          SequenceFlow,
          GatewayTypeFamily,
          StartEvent,
          EndEvent} from 'src/app/_models/bpmn';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { SubSink } from 'subsink';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { CommunicationService } from 'src/app/_services/communication.service';
import { Workflow } from 'src/app/_models/workflow';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit, OnDestroy {

  // @Input()
    process: Process;
  @Input()
    collaboration: Collaboration;
  @Input()
    workflow: Workflow;
    startEvent: StartEvent;
    endEvent: EndEvent;

    datatoshow = false;

    participants: Participant[];
    complexGateways: ComplexGateway[];
    eventbasedGateways: EventBasedGateway[];
    exclusiveGateways: ExclusiveGateway[];
    inclusiveGateways: InclusiveGateway[];
    parallelGateways: ParallelGateway[];
    sequenceFlows: SequenceFlow[];

    hasProcess = false;
    hasParticipant = false;
    hasStartEvent = false;
    hasEndEvent = false;
    hasComplexGateway = false;
    hasEventBasedGateway = false;
    hasExclusiveGateway = false;
    hasInclusiveGateway = false;
    hasParallelGateway = false;
    hasTask = false;
    hasSequenceFlow = false;


    masterTask: MasterTask[] = [];

  subs = new SubSink();

  constructor(
    private analysisService: AnalysisService,
    private communicationService: CommunicationService,
  ) {

  }

  ngOnInit() {

    if (this.analysisService.getProcessList().length > 0) {
      this.hasProcess = true;
      this.process = this.analysisService.getProcessList()[0];
    }

    if (this.analysisService.getStartEventList().length > 0) {
      this.hasStartEvent = true;
      this.startEvent = this.analysisService.getStartEventList()[0];
    }

    if (this.analysisService.getEndEventList().length > 0) {
      this.hasEndEvent = true;
      this.endEvent = this.analysisService.getEndEventList()[0];
    }

    this.participants = this.analysisService.getParticipantList() as unknown as Participant[];
    this.participants = this.analysisService.ListParticipantsInProcess(this.participants, this.process);
    this.hasParticipant = (this.participants.length > 0);

    this.sequenceFlows = this.analysisService.getFlowList();
    this.hasSequenceFlow = (this.sequenceFlows != null);

    if (this.analysisService.getTaskList(this.process.attr.id).length > 0) {
    this.complexGateways = this.analysisService.getGatewayList(
                GatewayTypeFamily.COMPLEX, this.process.attr.id ) as unknown as ComplexGateway[];
    this.eventbasedGateways = this.analysisService.getGatewayList(
                GatewayTypeFamily.EVENTBASED, this.process.attr.id ) as unknown as EventBasedGateway[];
    this.exclusiveGateways = this.analysisService.getGatewayList(
                GatewayTypeFamily.EXCLUSIVE, this.process.attr.id) as unknown as ExclusiveGateway[];
    this.inclusiveGateways = this.analysisService.getGatewayList(
                GatewayTypeFamily.INCLUSIVE, this.process.attr.id) as unknown as InclusiveGateway[];
    this.parallelGateways = this.analysisService.getGatewayList(
                GatewayTypeFamily.PARALLEL, this.process.attr.id) as unknown as ParallelGateway[];
    }

    this.hasComplexGateway = (this.complexGateways != null);
    this.hasEventBasedGateway = (this.eventbasedGateways != null);
    this.hasExclusiveGateway = (this.exclusiveGateways != null);
    this.hasInclusiveGateway = (this.inclusiveGateways != null);
    this.hasParallelGateway = (this.parallelGateways != null);

    if (this.analysisService.getTaskList(this.process.attr.id).length > 0) {
      this.hasTask = true;
      this.masterTask = this.analysisService.getTaskList(this.process.attr.id);
    }

    this.datatoshow = true;
  }



  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
