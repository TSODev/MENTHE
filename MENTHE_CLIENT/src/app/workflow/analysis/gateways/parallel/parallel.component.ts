import { Component, OnInit, Input } from '@angular/core';
import { ParallelGateway, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-parallel',
  templateUrl: './parallel.component.html',
  styleUrls: ['./parallel.component.css']
})
export class ParallelComponent implements OnInit {

  @Input()
  gateway: ParallelGateway;
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
