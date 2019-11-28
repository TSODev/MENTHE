import { Component, OnInit, Input } from '@angular/core';
import { ExclusiveGateway, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-exclusive',
  templateUrl: './exclusive.component.html',
  styleUrls: ['./exclusive.component.css']
})
export class ExclusiveComponent implements OnInit {

  @Input()
  gateway: ExclusiveGateway;
  taskIcon = '';

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
