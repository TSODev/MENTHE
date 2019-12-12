import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workflow } from 'src/app/_models/workflow';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SubSink } from 'subsink';
import * as bpmn from 'src/app/_models/bpmn';
import { CommunicationService } from 'src/app/_services/communication.service';
import { CommunicationMessage, CommunicationMessageHeader, Module } from 'src/app/_interfaces/communication.interface';
import { AnalysisMessagesHeaders } from 'src/app/_interfaces/analysis.interface';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';



@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit, OnDestroy {

  datatodisplay = false;
  analysisEnd = false;
  subs = new SubSink();

  bpmnData: bpmn.BpmnFile;
  workflow: Workflow;
  collaboration: bpmn.Collaboration;
  process: bpmn.Process;
  processes: bpmn.Process[] = [];
  participants: bpmn.Participant;

  hasToDisplayWorkflow = false;

  jsoncontent: string;

  constructor(
    private route: ActivatedRoute,
    private workflowService: WorkflowService,
    private analysisService: AnalysisService,
    private communicationService: CommunicationService,
  ) { }


  ngOnInit() {



    this.communicationService.announce(
      {
        header: AnalysisMessagesHeaders.STARTANALYSIS,
        module: Module.ANALYSIS,
        commObject: { object: {} }
      }
    );

    this.subs.add(
      this.workflowService.getWorkflowById(this.route.snapshot.params.id).subscribe(
        wf => {

          this.workflow = wf;

          this.communicationService.announce(
            {
              header: AnalysisMessagesHeaders.WORKFLOW,
              module: Module.ANALYSIS,
              commObject: { object: {
                workflow_id: wf.workflow_id,
                title: wf.title,
                description: wf.description,
                state: wf.state,
                status: wf.status,
               }}
            }
          );

          this.workflowService.getAnalizedData(wf.workflow_id).subscribe(
            element => {
                  Object.entries(element).forEach(
                    e => {

                      const header = Object.keys(e[1])[0];
                      switch (header) {
                        case 'collaboration':
                            const collaborations: bpmn.Collaboration[] = e[1]['collaboration'];
                            collaborations.forEach( c => {
                              this.collaboration = c;
                              this.communicateOnNewElement(AnalysisMessagesHeaders.PARTICIPANT, c.participant);
                            });
                            break;
                        case 'process':
                            this.processes = e[1]['process'];
                            this.processes.forEach(p => {
//                                  console.log(p.attr.id);
                                  this.communicateOnNewElement(AnalysisMessagesHeaders.PROCESS, p);
                                  // console.log(p.startEvent.attr.name);
                                  // this.communicateOnNewElement(AnalysisMessagesHeaders.STARTEVENT, p.startEvent, p.attr.id);
                                  Object.entries(p).forEach(
                                    entry => {
//                                  console.log(entry);
                                  this.communicateOnNewElement(entry[0].toUpperCase(), entry[1], p.attr.id);
                                  }
                              );
                            });
                            break;

                      }
                    });
                  this.communicationService.announce(
                      {
                        header: AnalysisMessagesHeaders.ENDANALYSIS,
                        module: Module.ANALYSIS,
                        commObject: { object: this.workflow }
                      }
                    );
                    }
                  );
          this.datatodisplay = true;
        }
      ));

  }

  displayWorkflow() {
    if (this.hasToDisplayWorkflow) {
      this.viewworkflow(this.workflow);
    }
    this.hasToDisplayWorkflow = !this.hasToDisplayWorkflow;
  }

  viewworkflow(wf: Workflow) {  }


  communicateOnNewElement(header: string, object: any, relatedToId?: string) {
    this.communicationService.announce(
      {header, module: Module.ANALYSIS, commObject: {
        object: this.analysisService.getElementAsArray(object), relatedToId }}
      );
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
