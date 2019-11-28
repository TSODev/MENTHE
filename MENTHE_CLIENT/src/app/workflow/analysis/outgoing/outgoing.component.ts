import { Component, OnInit, Input } from '@angular/core';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SequenceFlow } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.css']
})
export class OutgoingComponent implements OnInit {

  @Input()
    outgoing: string;

    linked: SequenceFlow[];

    outgoingArray: string[];
    links: SequenceFlow[];
    haslink = false;

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
    this.linked = this.analysisService.getLinkedFlowFromElementList(this.outgoing);
    console.log(this.outgoing , 'Linked To: ', this.linked);
    if (typeof this.linked !== 'undefined') {
      this.haslink = true;
      this.links = this.linked;
    }
  //  this.outgoingArray = this.analysisService.getElementAsArray(this.outgoing);
  }

}
