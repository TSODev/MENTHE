import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workflow } from 'src/app/_models/workflow';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SubSink } from 'subsink';
import * as bpmn from 'src/app/_models/bpmn';

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

    // const options = {
    //   attributeNamePrefix: '',
    //   attrNodeName: 'attr',
    //   textNodeName: '#text',
    //   ignoreAttributes: false,
    //   ignoreNameSpace: true,
    //   allowBooleanAttributes: true,
    //   parseNodeValue: true,
    //   parseAttributeValue: true,
    //   trimValues: true,
    // };

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
                this.analysisService.announceNewElement(p.startEvent, 'StartEvent', p.attr.id);
              }
              if (typeof p.endEvent !== 'undefined') {
                this.analysisService.announceNewElement(p.endEvent, 'EndEvent', p.attr.id);
              }
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.task), 'Standard', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.sendTask), 'Send', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.receiveTask), 'Receive', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.manualTask), 'Manual', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.scriptTask), 'Script', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.serviceTask), 'Service', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.businessruleTask), 'Business', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.callActivity), 'CallActivity', p.attr.id);




              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.complexGateway), 'Complex', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.exclusiveGateway), 'Exclusive', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.inclusiveGateway), 'Inclusive', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.parallelGateway), 'Parallel', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.eventbasedGateway), 'EventBased', p.attr.id);
              this.analysisService.announceNewElementArray(
                this.analysisService.getElementAsArray(p.sequenceFlow), 'Flow', p.attr.id);
            }
          );


          this.datatodisplay = true;
        }
    ));
      }


ngOnDestroy() {
  this.subs.unsubscribe();
}

}
