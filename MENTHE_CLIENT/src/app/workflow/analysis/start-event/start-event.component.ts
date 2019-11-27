import { Component, OnInit, Input } from '@angular/core';
import { StartEvent, SequenceFlow, Process } from 'src/app/_models/bpmn';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-start-event',
  templateUrl: './start-event.component.html',
  styleUrls: ['./start-event.component.css']
})
export class StartEventComponent implements OnInit {

  @Input()
    process: Process;
    linkedFlow : SequenceFlow;

  constructor(
    private workflowService: WorkflowService,
  ) { }

  ngOnInit() {

//    const startFlow = this.startEvent.outgoing;

    const flows = this.workflowService.getElementAsArray(this.process.sequenceFlow);
    this.linkedFlow = this.workflowService.getLinkedFlow(this.process.startEvent.outgoing, flows);
  }

}
