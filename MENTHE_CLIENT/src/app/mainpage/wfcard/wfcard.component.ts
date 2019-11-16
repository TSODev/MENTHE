import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Workflow } from "src/app/_models/workflow";
import { AlertService } from "src/app/_services";
import { Router } from "@angular/router";
import { WorkflowService } from "src/app/_services/workflow.service";
import { SubSink } from "subsink";

@Component({
  selector: "app-wfcard",
  templateUrl: "./wfcard.component.html",
  styleUrls: ["./wfcard.component.css"]
})
export class WfcardComponent implements OnInit, OnDestroy {
  @Input()
  workflow: Workflow;

  subs = new SubSink();

  constructor(
    private alertService: AlertService,
    private route: Router,
    private workflowService: WorkflowService
  ) {}

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  editWorkflow() {
    console.log('edit : ', this.workflow.workflow_id);
    this.route.navigate(['/workflow/edit/' + this.workflow.workflow_id]);
  }

  viewWorkflow() {
    console.log('view : ', this.workflow.workflow_id);
    this.route.navigate(['/workflow/view/' + this.workflow.workflow_id])
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
