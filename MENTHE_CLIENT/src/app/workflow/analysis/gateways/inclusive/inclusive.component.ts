import { Component, OnInit, Input } from '@angular/core';
import { InclusiveGateway } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-inclusive',
  templateUrl: './inclusive.component.html',
  styleUrls: ['./inclusive.component.css']
})
export class InclusiveComponent implements OnInit {

  @Input()
  gateway: InclusiveGateway;
  taskIcon = '';

  constructor() { }

  ngOnInit() {
  }

}
