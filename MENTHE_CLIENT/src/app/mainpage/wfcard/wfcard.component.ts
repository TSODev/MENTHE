import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Workflow } from 'src/app/_models/workflow';
import { AlertService, UserService } from 'src/app/_services';
import { Router } from '@angular/router';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { SubSink } from 'subsink';
import { User } from 'src/app/_models';


@Component({
  selector: 'app-wfcard',
  templateUrl: './wfcard.component.html',
  styleUrls: ['./wfcard.component.css']
})
export class WfcardComponent implements OnInit, OnDestroy {
  @Input()
  workflow: Workflow;
  createdBy = '';
  modifiedBy = '';

  svg: string;

  subs = new SubSink();

  constructor(
    private alertService: AlertService,
    private route: Router,
    private workflowService: WorkflowService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.svg = this.workflow.image;
//    console.log('WFCard : ', this.svg);
    this.subs.add(
    this.userService.getUserById(this.workflow.createdBy).subscribe(user => {
        this.createdBy = user.firstname.concat(' ', user.lastname);
    })
    );
    this.subs.add(
      this.userService.getUserById(this.workflow.lastModifiedBy).subscribe(user => {
          this.modifiedBy = user.firstname.concat(' ', user.lastname);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  manageWorkflow() {
    const wfmode = this.workflow.mode;
    const wfid = this.workflow.workflow_id;
    if (wfmode === 'ro') { this.route.navigate(['/workflow/view/' + wfid]); } else {
      this.route.navigate(['/workflow/edit/' + wfid]); }
  }

  deleteWorkflow() {
    this.subs.add(
      this.workflowService
        .delete(this.workflow.workflow_id)
        .subscribe(result => {
          if (result.status === 204) {
            this.alertService.success('Workflow deleted');
            this.route.navigate(['/dashboard']);
          } else {
            this.alertService.error('You cannot delete this workflow !');
          }
        })
    );
  }

  locked() {
    this.alertService.error('Workflow is locked !');
  }
}
