import { Component, OnInit, Input } from '@angular/core';
import { EventBasedGateway, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-eventbased',
  templateUrl: '../gateway.component.html',
  styleUrls: ['../gateway.component.css']
})
export class EventbasedComponent implements OnInit {

  @Input()
  gateway: EventBasedGateway;
  taskIcon = 'assets/task_icons/Gateway_EVENTBASED.png';
  type = '';

  incomings: SequenceFlow[];
  outgoings: SequenceFlow[];

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
    this.type = 'EVENTBASED';
    this.incomings = this.analysisService.getElementAsArray(this.gateway.incoming);
    this.outgoings = this.analysisService.getElementAsArray(this.gateway.outgoing);
  }

}
