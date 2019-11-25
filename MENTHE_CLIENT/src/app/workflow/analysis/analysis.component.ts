import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workflow } from 'src/app/_models/workflow';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { SubSink } from 'subsink';
import * as bpmn from 'src/app/_models/bpmn';
import * as parser from 'fast-xml-parser';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit, OnDestroy {

  //  @Output() addParticipant = new EventEmitter<bpmn.Participant>();


  datatodisplay = false;
  subs = new SubSink();
  workflow: Workflow;
  bpmnData: bpmn.BpmnFile;
  collaboration: bpmn.Collaboration;
  process: bpmn.Process;
  processes: bpmn.Process[] = [];
  participants: bpmn.Participant;
  jsoncontent: string;
  processInArray = false;
  emittedParticipants: bpmn.Participant[] = [];
  partInProcess: bpmn.Participant[] = [];
  partForProcess: bpmn.Participant[] = [];


  processAnalysis: [{ id: string, participants: bpmn.Participant[] }] = [{ id: '', participants: [] }];
  //  processAnalysis: [{ id: string , participants: bpmn.Participant[]}];


  constructor(
    private route: ActivatedRoute,
    private workflowService: WorkflowService,
  ) {  }


  ngOnInit() {

    const options = {
      attributeNamePrefix: '',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: true,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
    };

    const wfid = this.route.snapshot.params.id;

    this.subs.add(
      this.workflowService.getWorkflowById(wfid).subscribe(
        wf => {
          this.workflow = wf;
          this.bpmnData = this.workflowService.getBPMNData(wf);
          this.collaboration = this.bpmnData.definitions.collaboration;
          this.jsoncontent = JSON.stringify(this.bpmnData, null, '\t');

          this.process = this.bpmnData.definitions.process;
          this.processes = this.workflowService.getElementAsArray(this.process);
          this.datatodisplay = true;
        }
    ));
      }


ngOnDestroy() {
  this.subs.unsubscribe();
}

}
