import { Component, OnInit, Input } from '@angular/core';
import { EndEvent, Process, SequenceFlow } from 'src/app/_models/bpmn';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-end-event',
  templateUrl: './end-event.component.html',
  styleUrls: ['./end-event.component.css']
})
export class EndEventComponent implements OnInit {

  @Input()
    process: Process;
  @Input()
    endEvent: EndEvent;

    linkedFlow: SequenceFlow;
    incomings: SequenceFlow[];

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {
    this.incomings = this.analysisService.getElementAsArray(this.endEvent.incoming);
  }

}
