import { Component, OnInit, Input } from '@angular/core';
import { ParallelGateway } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-parallel',
  templateUrl: './parallel.component.html',
  styleUrls: ['./parallel.component.css']
})
export class ParallelComponent implements OnInit {

  @Input()
  gateway: ParallelGateway;
  taskIcon = '';

  constructor() { }

  ngOnInit() {
  }

}
