import { Component, OnInit, Input } from '@angular/core';
import { ExclusiveGateway, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-exclusive',
  templateUrl: '../gateway.component.html',
  styleUrls: ['../gateway.component.css']
})
export class ExclusiveComponent implements OnInit {

  @Input()
  gateway: ExclusiveGateway;
  taskIcon = 'assets/task_icons/Gateway_EXCLUSIVE.png';
  type = '';

  incomings: SequenceFlow[];
  outgoings: SequenceFlow[];


  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
    this.type = 'EXCLUSIVE';
    this.incomings = this.analysisService.getElementAsArray(this.gateway.incoming);
    this.outgoings = this.analysisService.getElementAsArray(this.gateway.outgoing);
  }

}
