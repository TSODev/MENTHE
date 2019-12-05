import { Component, OnInit, Input } from '@angular/core';
import { ComplexGateway, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-complex',
  templateUrl: '../gateway.component.html',
  styleUrls: ['../gateway.component.css']
})
export class ComplexComponent implements OnInit {

  @Input()
  gateway: ComplexGateway;
  taskIcon = 'assets/task_icons/Gateway_COMPLEX.png';
  type = '';

  incomings: SequenceFlow[];
  outgoings: SequenceFlow[];

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
    this.type = 'COMPLEX';
    this.incomings = this.analysisService.getElementAsArray(this.gateway.incoming);
    this.outgoings = this.analysisService.getElementAsArray(this.gateway.outgoing);
  }

}
