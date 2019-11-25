import { Component, OnInit, Input } from '@angular/core';
import { StartEvent } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-start-event',
  templateUrl: './start-event.component.html',
  styleUrls: ['./start-event.component.css']
})
export class StartEventComponent implements OnInit {

  @Input()
    startEvent: StartEvent;

  constructor() { }

  ngOnInit() {
  }

}
