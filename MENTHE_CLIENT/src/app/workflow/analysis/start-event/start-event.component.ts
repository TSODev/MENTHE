import { Component, OnInit, Input } from '@angular/core';
import { StartEvent, SequenceFlow, Process } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-start-event',
  templateUrl: './start-event.component.html',
  styleUrls: ['./start-event.component.css']
})
export class StartEventComponent implements OnInit {

  @Input()
    process: Process;
  @Input()
    startEvent: StartEvent;

    outgoings: SequenceFlow[];
//    linkedFlow: SequenceFlow;

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {

    this.outgoings = this.analysisService.getElementAsArray(this.startEvent.outgoing);
  }

}
