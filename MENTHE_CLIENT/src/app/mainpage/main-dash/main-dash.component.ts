import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../../_services';
import { Workflow } from '../../_models/workflow';
import { WorkflowService } from '../../_services/workflow.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/observable/of';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';


@Component({
  selector: 'app-main-dash',
  templateUrl: './main-dash.component.html',
  styleUrls: ['./main-dash.component.css']
})

export class MainDashComponent implements OnInit, OnDestroy {

  workflows: Workflow[];
  subs = new SubSink();

  dashForm: FormGroup;
  filter = '';

  constructor(
    private workflowService: WorkflowService,
    private formBuilder: FormBuilder,
    private route: Router,
    private alert: AlertService
  ) { }

  ngOnInit() {
    console.log('Dashboard Component');
    this.dashForm = this.formBuilder.group({
      filter: ['']
    });
    this.dashForm.controls['filter'].valueChanges.pipe(
      debounceTime(250))
      .subscribe(data => {
          this.filter = data;
          });
    this.loadWorkflows();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadWorkflows() {
    this.subs.add(
      this.workflowService.getAllWorkflow().subscribe(
        workflows => {
          this.workflows = workflows;
        }
      )
    );
  }

  onDelete($event) {
    this.workflows = this.workflowsRemoveById(this.workflows, $event);
  }

  workflowsRemoveById(arr: Workflow[], id: string): Workflow[] {

    const removed = arr.splice(
        arr.indexOf(
          arr.find((e) => (e.workflow_id === id))
        ), 1);

    return arr;
  }


}
