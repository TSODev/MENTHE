import { Component, OnInit, Input } from '@angular/core';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.css']
})
export class IncomingComponent implements OnInit {

  @Input()
    incoming: string;

  incomingArray: string[];

  constructor(
    private workflowService: WorkflowService,
  ) { }

  ngOnInit() {
    this.incomingArray = this.workflowService.getElementAsArray(this.incoming);
  }

}
