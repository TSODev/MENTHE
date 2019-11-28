import { Component, OnInit, Input } from '@angular/core';
import { Participant } from 'src/app/_models/bpmn';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  @Input()
    participant: Participant;
  constructor(
    private workflowService: WorkflowService,
  ) { }

  ngOnInit() {
  }

}
