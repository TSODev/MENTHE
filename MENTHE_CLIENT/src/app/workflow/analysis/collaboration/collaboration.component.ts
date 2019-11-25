import { Component, OnInit, Input } from '@angular/core';
import { Collaboration, Participant } from 'src/app/_models/bpmn';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.css']
})
export class CollaborationComponent implements OnInit {

  @Input()
    collaboration: Collaboration;
    // participant: Participant;
    // participants: Participant[] = [];
    // participantInArray = false;
    datatodisplay = false;

  constructor(
    private workflowService: WorkflowService,
  ) { }

  ngOnInit() {
    // this.participant = this.collaboration.participant;
    // this.participants = this.workflowService.getElementAsArray(this.participant);
    // this.participants.forEach(data => {
    //   this.workflowService.announceNewParticipant(data);
    // });

    this.datatodisplay = true;
  }

}
