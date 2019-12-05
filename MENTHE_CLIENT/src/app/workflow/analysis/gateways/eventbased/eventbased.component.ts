import { Component, OnInit, Input } from '@angular/core';
import { EventBasedGateway } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-eventbased',
  templateUrl: '../gateway.component.html',
  styleUrls: ['../gateway.component.css']
})
export class EventbasedComponent implements OnInit {

  @Input()
  gateway: EventBasedGateway;
  taskIcon = 'assets/task_icons/Gateway_EVENTBASED.png';

  constructor() { }

  ngOnInit() {
  }

}
