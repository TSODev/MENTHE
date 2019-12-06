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
import * as Viewer from 'bpmn-js/dist/bpmn-viewer.development.js';
import { AlertService } from 'src/app/_services';
import { Router } from '@angular/router';
import { Module } from 'src/app/_interfaces/communication.interface';
import { PublishMessageHeader } from 'src/app/_interfaces/publish.interface';

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
    hasToDisplayWorkflow = false;

    viewer: Viewer;

    masterTask: MasterTask[] = [];

  subs = new SubSink();

  constructor(
    private router: Router,
    private alertService: AlertService,
    private analysisService: AnalysisService,
    private communicationService: CommunicationService,
  ) {

  }

  ngOnInit() {

    this.communicationService.announce(
      {
        module: Module.PUBLISH,
        header: PublishMessageHeader.STARTPUBLISHING,
        commObject: {object: {}}
      }
    );

    if (this.analysisService.getProcessList().length > 0) {
      this.hasProcess = true;
      this.process = this.analysisService.getProcessList()[0];
    }

    if (this.analysisService.getStartEventList().length > 0) {
      this.hasStartEvent = true;
      this.startEvent = this.analysisService.getStartEventList()[0];
    } else {
      this.alertService.error('It is mandatory to have a Start Event in a workflow !', true);
    }

    if (this.analysisService.getEndEventList().length > 0) {
      this.hasEndEvent = true;
      this.endEvent = this.analysisService.getEndEventList()[0];
    } else {
      this.alertService.error('It is mandatory to have a End Event in a workflow !', true);
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

    this.communicationService.announce(
      {
        module: Module.PUBLISH,
        header: PublishMessageHeader.ENDPUBLISHING,
        commObject: {object: {}}
      }
    );

    this.datatoshow = true;
  }

  displayWorkflow() {
    if (this.hasToDisplayWorkflow) {
      this.viewworkflow(this.workflow);
    }
    this.hasToDisplayWorkflow = !this.hasToDisplayWorkflow;
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  viewworkflow(wf: Workflow) {


  }
}
