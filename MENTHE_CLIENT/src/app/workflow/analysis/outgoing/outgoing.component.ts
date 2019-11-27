import { Component, OnInit, Input } from '@angular/core';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { SequenceFlow } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.css']
})
export class OutgoingComponent implements OnInit {

  @Input()
    outgoing: string;
  @Input()
    linked: SequenceFlow;

    outgoingArray: string[];
    link: SequenceFlow;
    haslink = false;

  constructor(
    private workflowService: WorkflowService,
  ) { }

  ngOnInit() {
    console.log('Linked : ', this.linked);
    if (typeof this.linked != 'undefined') {
      this.haslink = true;
      this.link = this.linked;
    }
    this.outgoingArray = this.workflowService.getElementAsArray(this.outgoing);
  }

}
