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
  ) {

  }

  ngOnInit() {

    // this.hasStartEvent = (this.process.startEvent.attr.id != null);
    // this.hasEndEvent = (this.process.endEvent.attr.id != null);

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

    this.complexGateways = this.analysisService.getGatewayList(GatewayTypeFamily.COMPLEX) as unknown as ComplexGateway[];
    this.eventbasedGateways = this.analysisService.getGatewayList(GatewayTypeFamily.EVENTBASED) as unknown as EventBasedGateway[];
    this.exclusiveGateways = this.analysisService.getGatewayList(GatewayTypeFamily.EXCLUSIVE) as unknown as ExclusiveGateway[];
    this.inclusiveGateways = this.analysisService.getGatewayList(GatewayTypeFamily.INCLUSIVE) as unknown as InclusiveGateway[];
    this.parallelGateways = this.analysisService.getGatewayList(GatewayTypeFamily.PARALLEL) as unknown as ParallelGateway[];

    this.hasComplexGateway = (this.complexGateways != null);
    this.hasEventBasedGateway = (this.eventbasedGateways != null);
    this.hasExclusiveGateway = (this.exclusiveGateways != null);
    this.hasInclusiveGateway = (this.inclusiveGateways != null);
    this.hasParallelGateway = (this.parallelGateways != null);

    if (this.analysisService.getTaskList().length > 0) {
      this.hasTask = true;
      this.masterTask = this.analysisService.getTaskList();
    }

//    this.analysisService.announceNewElementArray(this.masterTask, 'Task');
    this.analysisService.emit({step: 'process_end'});
    this.datatoshow = true;
  }



  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}