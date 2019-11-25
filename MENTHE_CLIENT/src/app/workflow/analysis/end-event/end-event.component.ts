import { Component, OnInit, Input } from '@angular/core';
import { EndEvent } from 'src/app/_models/bpmn';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-end-event',
  templateUrl: './end-event.component.html',
  styleUrls: ['./end-event.component.css']
})
export class EndEventComponent implements OnInit {

  @Input()
    endEvent: EndEvent;

    endEvents: EndEvent[];

  constructor(
    private workflowService: WorkflowService,
  ) { }

  ngOnInit() {
    this.endEvents = this.workflowService.getElementAsArray(this.endEvent);

  }

}
