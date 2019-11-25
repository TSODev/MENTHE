import { Component, OnInit, Input } from '@angular/core';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.css']
})
export class OutgoingComponent implements OnInit {

  @Input()
    outgoing: string;

    outgoingArray: string[];

  constructor(
    private workflowService: WorkflowService,
  ) { }

  ngOnInit() {
    this.outgoingArray = this.workflowService.getElementAsArray(this.outgoing);
  }

}
