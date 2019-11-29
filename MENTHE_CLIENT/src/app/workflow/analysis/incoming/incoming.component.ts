import { Component, OnInit, Input } from '@angular/core';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SequenceFlow } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.css']
})
export class IncomingComponent implements OnInit {

  @Input()
    incoming: string;

    linked: SequenceFlow[];

    incomingArray: string[];
    haslink = false;
    links: SequenceFlow[];

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
    this.linked = this.analysisService.getLinkedFlowFromElementList(this.incoming);
//    console.log(this.incoming , 'Linked To: ', this.linked);
    if (typeof this.linked !== 'undefined') {
      this.haslink = true;
      this.links = this.linked;
    }
  }

}
