import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workflow } from 'src/app/_models/workflow';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SubSink } from 'subsink';
import * as bpmn from 'src/app/_models/bpmn';
// import * as parser from 'fast-xml-parser';
// import { Observable } from 'rxjs/internal/Observable';
// import { ElementList } from 'src/app/_interfaces/analysis.interface';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit, OnDestroy {

  datatodisplay = false;
  analysisEnd = false;
  subs = new SubSink();
//  workflow: Workflow;

  bpmnData: bpmn.BpmnFile;
  collaboration: bpmn.Collaboration;
  process: bpmn.Process;
  processes: bpmn.Process[] = [];
  participants: bpmn.Participant;

  jsoncontent: string;

  constructor(
    private route: ActivatedRoute,
    private workflowService: WorkflowService,
    private analysisService: AnalysisService,
  ) {}


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

    // const wfid = this.route.snapshot.params.id;

    this.analysisService.emit({step: 'start'});

    this.subs.add(
      this.workflowService.getWorkflowById(this.route.snapshot.params.id).subscribe(
        wf => {
//          this.workflow = wf;
          this.bpmnData = this.workflowService.getBPMNData(wf);
          this.jsoncontent = JSON.stringify(this.bpmnData, null, '\t');

          this.collaboration = this.bpmnData.definitions.collaboration;
          this.analysisService.announceNewElement(this.collaboration, 'Collaboration');

          this.process = this.bpmnData.definitions.process;
          this.processes = this.analysisService.getElementAsArray(this.process);
          this.analysisService.announceNewElementArray(this.processes, 'Process');

          this.analysisService.announceNewElementArray(
              this.analysisService.getElementAsArray(this.collaboration.participant), 'Participant');

          this.processes.forEach(
            p => {
              if (typeof p.startEvent !== 'undefined') {
                this.analysisService.announceNewElement(p.startEvent, 'StartEvent');
              }
              if (typeof p.endEvent !== 'undefined') {
                this.analysisService.announceNewElement(p.endEvent, 'EndEvent');
              }
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.task), 'Standard');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.sendTask), 'Send');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.receiveTask), 'Receive');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.manualTask), 'Manual');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.scriptTask), 'Script');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.serviceTask), 'Service');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.businessruleTask), 'Business');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.callActivity), 'CallActivity');




              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.complexGateway), 'Complex');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.exclusiveGateway), 'Exclusive');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.inclusiveGateway), 'Inclusive');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.parallelGateway), 'Parallel');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.eventbasedGateway), 'EventBased');
              this.analysisService.announceNewElementArray(this.analysisService.getElementAsArray(p.sequenceFlow), 'Flow');
            }
          );


          this.datatodisplay = true;
        }
    ));
      }


ngOnDestroy() {
  this.subs.unsubscribe();
}

clearElementList() {
  //  console.log('LIST has been cleared !')
  // this.ProcessList = [];
  // this.ParticipantList = [];
  // this.TaskList = [];
  // this.GatewayList = [];
  // this.FlowList = [];
}

}
