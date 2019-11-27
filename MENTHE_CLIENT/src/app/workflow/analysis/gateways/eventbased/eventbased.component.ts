import { Component, OnInit, Input } from '@angular/core';
import { EventBasedGateway } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-eventbased',
  templateUrl: './eventbased.component.html',
  styleUrls: ['./eventbased.component.css']
})
export class EventbasedComponent implements OnInit {

  @Input()
  gateway: EventBasedGateway;
  taskIcon = '';

  constructor() { }

  ngOnInit() {
  }

}
