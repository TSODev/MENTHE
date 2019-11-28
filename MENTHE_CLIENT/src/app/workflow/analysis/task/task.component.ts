import { Component, OnInit, Input } from '@angular/core';
import { Task, MasterTask, TaskTypeEnumerated, SequenceFlow } from 'src/app/_models/bpmn';
import { statusType } from 'src/app/_models/workflow';
import { AnalysisService } from 'src/app/_services/analysis.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
    task: MasterTask;

    taskIcon = '';
    statusClass = '';
    status = statusType.WAITING;    //ToDo : Add status to task !

  constructor(
    private analysisService: AnalysisService,
  ) { }

  ngOnInit() {

    const iconPath = 'assets/task_icons/';
    this.taskIcon = iconPath.concat('Task_').concat(this.task.type).concat('.png');

  }

}
