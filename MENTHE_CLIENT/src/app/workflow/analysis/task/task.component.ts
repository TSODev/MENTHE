import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
    tasks: Task[];

  constructor() { }

  ngOnInit() {
  }

}
