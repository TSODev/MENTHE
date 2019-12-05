import { Component, OnInit, Input } from '@angular/core';
import { InclusiveGateway, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-inclusive',
  templateUrl: '../gateway.component.html',
  styleUrls: ['../gateway.component.css']
})
export class InclusiveComponent implements OnInit {

  @Input()
  gateway: InclusiveGateway;
  taskIcon = 'assets/task_icons/Gateway_INCLUSIVE.png';

  incomings: SequenceFlow[];
  outgoings: SequenceFlow[];

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
    this.incomings = this.analysisService.getElementAsArray(this.gateway.incoming);
    this.outgoings = this.analysisService.getElementAsArray(this.gateway.outgoing);
  }

}
