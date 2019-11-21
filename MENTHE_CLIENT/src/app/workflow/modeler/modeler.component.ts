import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkflowService } from '../../_services/workflow.service';
import * as Modeler from 'bpmn-js/dist/bpmn-modeler.development.js';
import OriginModule from 'diagram-js';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import { Workflow } from 'src/app/_models/workflow';
import { SubSink } from 'subsink';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services';

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css']
})
export class ModelerComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  modelForm: FormGroup;
  submitted = false;

  modeler: Modeler;
  canbesaved = true;
  editmode = false;
  currentWorkFlow: Workflow;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private workflow: WorkflowService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required]
    }
    );

    this.modeler = new Modeler({
      additionalModules: [
        OriginModule,
        propertiesPanelModule,
        propertiesProviderModule
      ],
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties-panel-parent'
      }
    });

    this.editmode = this.route.snapshot.url[1].toString() === 'edit';

    if (this.editmode) {
      this.editworkflow(this.route.snapshot.params.id);
    } else {
      this.createWorkflow();
    }
  }

  get f() { return this.modelForm.controls; }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.modeler.destroy();
  }

  onSubmit() {
    this.submitted = true;

    if (this.modelForm.invalid) {
      return;
    }


    if (this.editmode) {
      this.updateWorkflow(this.f.name.value, this.f.desc.value);
    } else {
      this.saveWorkflow(this.f.name.value, this.f.desc.value);
    }

  }

  createWorkflow() {
    this.subs.add(
      this.http
        .get('assets/diagram.bpmn', {
          headers: new HttpHeaders().set('Content-Type', 'text/xml'),
          responseType: 'text'
        })
        .subscribe(xml => {
          const wf = new Workflow();
          this.modeler.importXML(xml, err => {
            if (err) {
              return console.error('could not import BPMN diagram', err);
            }
            const canvas = this.modeler.get('canvas');
            const overlays = this.modeler.get('overlays');
            canvas.zoom('fit-viewport');
            this.currentWorkFlow = this.getCurrentWorkflow(wf);
          });
        })
    );
  }

  getCurrentWorkflow(workflow: Workflow): Workflow {
    this.modeler.saveXML({ format: true }, (error, xml) => {
      workflow.xmlcontent = xml;
    });
    return workflow;
  }

  updateWorkflow(name: string, description: string) {
    console.log('Workflow need to be updated');
    this.getCurrentWorkflow(this.currentWorkFlow); // update the xmlcontent
    this.currentWorkFlow.title = name;
    this.currentWorkFlow.description = description;
    this.modeler.saveSVG({}, (err, svg) => {
      if (err) {
        console.log('Export SVG Erreor : ', err);
      }
      if (svg) {
        this.currentWorkFlow.image = svg;
      }
    });
    // this.currentWorkFlow.lastModifiedDate = new Date();
    // this.subs.add(
    //   this.userService.getCurrentUser().subscribe(user => {
    //   this.currentWorkFlow.lastModifiedBy = user.firstname.concat(' ', user.lastname);
    this.subs.add(
        this.workflow.update(this.currentWorkFlow).subscribe(data => {
          this.router.navigate(['/dashboard']);
        })
      );
    // }));
  }

  saveWorkflow(name: string, description: string) {
    console.log('Workflow need to be saved');
    this.getCurrentWorkflow(this.currentWorkFlow); // update the xmlcontent
    this.currentWorkFlow.workflow_id = '';
    this.currentWorkFlow.mode = 'rw';
    this.currentWorkFlow.title = name;
    this.currentWorkFlow.description = description;
    this.modelForm.controls.name.setValue(this.currentWorkFlow.title);
    this.modelForm.controls.desc.setValue(this.currentWorkFlow.description);
    this.modeler.saveSVG({}, (err, svg) => {
      if (err) {
        console.log('Export SVG Error : ', err);
      }
      if (svg) {
        this.currentWorkFlow.image = svg;
      }
    });
    // this.currentWorkFlow.createDate = new Date();
    // this.subs.add(
    //   this.userService.getCurrentUser().subscribe(user => {
    //     this.currentWorkFlow.createdBy = user.firstname.concat(' ', user.lastname);
    this.subs.add(
          this.workflow
            .create(this.currentWorkFlow)
            .subscribe(wf => {
              this.router.navigate(['/dashboard']);
            })
        );
    //   })
    // );

  }

  editworkflow(workflowId) {
    this.subs.add(
      this.workflow.getWorkflowById(workflowId).subscribe(wf => {
        this.modeler.importXML(wf.xmlcontent, err => {
          if (err) {
            return console.error('could not import BPMN diagram', err);
          }
          const canvas = this.modeler.get('canvas');
          const overlays = this.modeler.get('overlays');
          canvas.zoom('fit-viewport');
          this.canbesaved = wf.mode !== 'ro';
          this.modelForm.controls.name.setValue(wf.title);
          this.modelForm.controls.desc.setValue(wf.description);
          this.currentWorkFlow = this.getCurrentWorkflow(wf);
        });
      })
    );
  }

}
