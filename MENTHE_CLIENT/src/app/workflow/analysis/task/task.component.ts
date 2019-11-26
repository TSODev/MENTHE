import { Component, OnInit, Input } from '@angular/core';
import { Task, MasterTask, TaskTypeEnumerated } from 'src/app/_models/bpmn';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
    task: MasterTask;

    taskIcon = '';
    taskIdentifier = '';


  constructor() { }

  ngOnInit() {

    const iconPath = 'assets/task_icons/';
    this.taskIcon = iconPath.concat('Task_').concat(this.task.type).concat('.png');

    if (this.task.attr.name != null) {
        this.taskIdentifier = this.task.attr.name;
    } else {
        this.taskIdentifier = this.task.attr.id;
    }
  }

}
