import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { WorkflowService } from '../../_services/workflow.service';
import * as Modeler from 'bpmn-js/dist/bpmn-modeler.development.js';
import OriginModule from 'diagram-js';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import { Workflow } from 'src/app/_models/workflow';
import * as parser from 'fast-xml-parser';
import { SubSink } from 'subsink';
import * as he from 'he';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css']
})
export class ModelerComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  modelForm: FormGroup;
  submitted = false;

  // xmlWF = '';
  // jsonWF = {};

  // options = {
  //   attributeNamePrefix: '@_',
  //   attrNodeName: 'attr', //default is 'false'
  //   textNodeName: '#text',
  //   ignoreAttributes: false,
  //   ignoreNameSpace: false,
  //   allowBooleanAttributes: false,
  //   parseNodeValue: true,
  //   parseAttributeValue: false,
  //   trimValues: true,
  //   cdataTagName: '__cdata', //default is 'false'
  //   cdataPositionChar: '\\c',
  //   localeRange: '', //To support non english character in tag/attribute values.
  //   parseTrueNumberOnly: false,
  //   arrayMode: false, //'strict'
  //   attrValueProcessor: (val, attrName) =>
  //     he.decode(val, { isAttributeValue: true }), //default is a=>a
  //   tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
  //   stopNodes: ['parse-me-as-string']
  // };

  modeler: Modeler;
  canbesaved = true;
  editmode = false;
  viewmode = false;
  // wfname = '';
  currentWorkFlow: Workflow;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private workflow: WorkflowService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      name: ['', Validators.required]
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
    this.viewmode = this.route.snapshot.url[1].toString() === 'view';
    //    const wfid = this.route.snapshot.params['id'];

    if (this.editmode) {
      this.editworkflow(this.route.snapshot.params['id']);
    } else {
      if (this.viewmode) {
        this.viewworkflow(this.route.snapshot.params['id']);
      } else {
      this.createWorkflow();
      }
    }
  }

  get f() { return this.modelForm.controls; }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;

    console.log('Submit: view > ', this.viewmode , ' edit > ' , this.editmode);
    if (this.viewmode) {
      this.router.navigate(['/dashboard']);
    }
    // stop here if form is invalid
    if (this.modelForm.invalid) {
      return;
    }

    if (this.viewmode) {
      this.viewworkflow(this.f.name.value);
    } else {


    if (this.editmode) {
        this.updateWorkflow(this.f.name.value);
      } else {
        this.saveWorkflow(this.f.name.value);
      }
    }

  }

  createWorkflow() {
    // const id = '318ee4e0-dca3-4561-b98d-f62751c7d228';          // Initial
    // const id = '355cf8d2-12f9-461f-8377-d183b5bfa9fe';       // Pizza

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
//            this.wfname = wf.title;
            this.currentWorkFlow = this.getCurrentWorkflow(wf);
            //            this.router.navigate(['/dashboard']);
          });
        })
    );

    // this.subs.add(
    //   this.workflow.getWorkflowById(id).subscribe(wf => {
    //     //        this.xmlWF = wf.xmlcontent;
    //     //        console.log('xmlWF :', this.xmlWF);

    //   })
    // );
  }

  getCurrentWorkflow(workflow: Workflow): Workflow {
    this.modeler.saveXML({ format: true }, (error, xml) => {
      workflow.xmlcontent = xml;
    });
    return workflow;
    /*     try {
      this.jsonWF = parser.parse(this.xmlWF, this.options);
    } catch (error) {
      console.log(error.message);
    } */
  }

  updateWorkflow(name: string) {
    console.log('Workflow need to be updated');
    this.getCurrentWorkflow(this.currentWorkFlow); // update the xmlcontent
    this.currentWorkFlow.title = name;
    this.subs.add(
      this.workflow.update(this.currentWorkFlow).subscribe(data => {
        this.router.navigate(['/dashboard']);
      })
    );
  }

  saveWorkflow(name: string) {
    console.log('Workflow need to be saved');
    this.getCurrentWorkflow(this.currentWorkFlow); // update the xmlcontent
    this.currentWorkFlow.workflow_id = '';
    this.currentWorkFlow.mode = 'rw';
    this.currentWorkFlow.title = name;
    this.modelForm.controls.name.setValue(this.currentWorkFlow.title);
    this.modeler.saveSVG({}, (err, svg) => {
      if (err) {
        console.log('Export SVG Error : ', err);
      }
      if (svg) {
        this.currentWorkFlow.image = svg;
      }
    });
    this.subs.add(
      this.workflow
        .create(this.currentWorkFlow)
        .subscribe(wf => {
          //          this.currentWorkFlow = wf;
          this.router.navigate(['/dashboard']);
        })
    );
    //    this.updateAction = true;   // Next action should be update !
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
          this.currentWorkFlow = this.getCurrentWorkflow(wf);
        });
      })
    );
  }

  viewworkflow(workflowId) {
    this.subs.add(
      this.workflow.getWorkflowById(workflowId).subscribe(wf => {
        this.modeler.importXML(wf.xmlcontent, err => {
          if (err) {
            return console.error('could not import BPMN diagram', err);
          }
          const canvas = this.modeler.get('canvas');
          const overlays = this.modeler.get('overlays');
          canvas.zoom('fit-viewport');
          this.canbesaved = false;
          this.modelForm.controls.name.setValue(wf.title);
          this.currentWorkFlow = this.getCurrentWorkflow(wf);
        });
      })
    );
  }

}
