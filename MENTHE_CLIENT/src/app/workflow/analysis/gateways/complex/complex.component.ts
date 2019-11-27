import { Component, OnInit, Input } from '@angular/core';
import { ComplexGateway } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-complex',
  templateUrl: './complex.component.html',
  styleUrls: ['./complex.component.css']
})
export class ComplexComponent implements OnInit {

  @Input()
  gateway: ComplexGateway;
  taskIcon = '';

  constructor() { }

  ngOnInit() {
  }

}
