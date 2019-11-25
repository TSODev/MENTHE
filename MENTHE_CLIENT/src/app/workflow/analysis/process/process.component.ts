import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Process, Participant, Collaboration } from 'src/app/_models/bpmn';
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

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
