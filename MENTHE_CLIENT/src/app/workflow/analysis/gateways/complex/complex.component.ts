import { Component, OnInit, Input } from '@angular/core';
import { ComplexGateway } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-complex',
  templateUrl: '../gateway.component.html',
  styleUrls: ['../gateway.component.css']
})
export class ComplexComponent implements OnInit {

  @Input()
  gateway: ComplexGateway;
  taskIcon = 'assets/task_icons/Gateway_COMPLEX.png';

  constructor() { }

  ngOnInit() {
  }

}
