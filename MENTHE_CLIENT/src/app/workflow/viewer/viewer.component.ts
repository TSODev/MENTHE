import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkflowService } from '../../_services/workflow.service';
import * as Viewer from 'bpmn-js/dist/bpmn-viewer.development.js';
import { Workflow } from 'src/app/_models/workflow';
import { SubSink } from 'subsink';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  submitted = false;

  viewer: Viewer;
  canbesaved = true;
  editmode = false;
  viewmode = false;
  currentWorkFlow: Workflow;

  constructor(
    private workflow: WorkflowService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.viewer = new Viewer({
      container: '#canvas',
    });

    this.viewworkflow(this.route.snapshot.params['id']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;

    console.log('Submit: view > ', this.viewmode , ' edit > ' , this.editmode);

    this.router.navigate(['/dashboard']);
  }

  getCurrentWorkflow(workflow: Workflow): Workflow {
    this.viewer.saveXML({ format: true }, (error, xml) => {
      workflow.xmlcontent = xml;
    });
    return workflow;
  }

  viewworkflow(workflowId) {
    this.subs.add(
      this.workflow.getWorkflowById(workflowId).subscribe(wf => {
        this.viewer.importXML(wf.xmlcontent, err => {
          if (err) {
            return console.error('could not import BPMN diagram', err);
          }
          const canvas = this.viewer.get('canvas');
          const overlays = this.viewer.get('overlays');
          canvas.zoom('fit-viewport');
          this.canbesaved = false;
          this.currentWorkFlow = this.getCurrentWorkflow(wf);
        });
      })
    );
  }

}
