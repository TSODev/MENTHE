import { Component, OnInit, Input } from '@angular/core';
import * as Viewer from 'bpmn-js/dist/bpmn-viewer.development.js';
import { Workflow } from 'src/app/_models/workflow';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basicviewer',
  templateUrl: './basicviewer.component.html',
  styleUrls: ['./basicviewer.component.css']
})
export class BasicviewerComponent implements OnInit {

  @Input()
  workflow: Workflow;

  viewer = new Viewer();
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.viewer = new Viewer({
      container: '#canvas',
    });

    this.viewer.importXML(this.workflow.xmlcontent, err => {
      if (err) {
        return console.error('could not import BPMN diagram', err);
      }
      const canvas = this.viewer.get('canvas');
//      const overlays = this.viewer.get('overlays');
      canvas.zoom('fit-viewport');

    });
  }

  canvasClick() {                       // ToDo : Add a dialog to confirm user want to edit the diagram
    if (this.workflow.readonly === false) {
      this.router.navigate([('/workflow/edit/').concat(this.workflow.workflow_id)]);
    }

  }

}
