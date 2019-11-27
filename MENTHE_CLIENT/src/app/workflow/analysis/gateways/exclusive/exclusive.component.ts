import { Component, OnInit, Input } from '@angular/core';
import { ExclusiveGateway } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-exclusive',
  templateUrl: './exclusive.component.html',
  styleUrls: ['./exclusive.component.css']
})
export class ExclusiveComponent implements OnInit {

  @Input()
  gateway: ExclusiveGateway;
  taskIcon = '';

  constructor() { }

  ngOnInit() {
  }

}
