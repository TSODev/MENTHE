import { Component, OnInit, Input } from '@angular/core';
import { ParallelGateway, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-parallel',
  templateUrl: '../gateway.component.html',
  styleUrls: ['../gateway.component.css']
})
export class ParallelComponent implements OnInit {

  @Input()
  gateway: ParallelGateway;
  taskIcon = 'assets/task_icons/Gateway_PARALLEL.png';
  type = '';

  incomings: SequenceFlow[];
  outgoings: SequenceFlow[];

  constructor(
      private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
      this.type = 'PARALLEL';
      this.incomings = this.analysisService.getElementAsArray(this.gateway.incoming);
      this.outgoings = this.analysisService.getElementAsArray(this.gateway.outgoing);
  }

}
