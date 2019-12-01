import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workflow } from 'src/app/_models/workflow';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { AnalysisService } from 'src/app/_services/analysis.service';
import { SubSink } from 'subsink';
import * as bpmn from 'src/app/_models/bpmn';
import { MenthePhase, MentheStep } from 'src/app/_interfaces/analysis.interface';
import { CommunicationService } from 'src/app/_services/communication.service';
import { CommunicationMessage, CommunicationMessageHeader, Module } from 'src/app/_interfaces/communication.interface';
import { AnalysisMessagesHeaders } from 'src/app/_interfaces/analysis.interface';



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
  collaboration: bpmn.Collaboration;
  process: bpmn.Process;
  processes: bpmn.Process[] = [];
  participants: bpmn.Participant;

  jsoncontent: string;

  constructor(
    private route: ActivatedRoute,
    private workflowService: WorkflowService,
    private analysisService: AnalysisService,
    private communicationService: CommunicationService,
  ) { }


  ngOnInit() {


    //    this.communicationService.emit({phase: MenthePhase.ANALYSIS, step: MentheStep.START});
    this.communicationService.announce(
      {
        header: CommunicationMessageHeader.COMMUNICATION,
        module: Module.COMMUNICATION,
        commObject: { object: { phase: MenthePhase.ANALYSIS, step: MentheStep.START } }
      }
    );

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
          this.bpmnData = this.workflowService.getBPMNData(wf);
          this.jsoncontent = JSON.stringify(this.bpmnData, null, '\t');

          this.collaboration = this.bpmnData.definitions.collaboration;
          //          this.communicationService.announceNewElement(this.collaboration, 'Collaboration');
          this.communicationService.announce(
            {
              header: AnalysisMessagesHeaders.COLLABORATION,
              module: Module.ANALYSIS,
              commObject: { object: this.collaboration }
            });

          this.process = this.bpmnData.definitions.process;
          this.processes = this.analysisService.getElementAsArray(this.process);
          //          this.communicationService.announceNewElementArray(this.processes, 'Process');
          this.communicationService.announce({
            header: AnalysisMessagesHeaders.PROCESS,
            module: Module.ANALYSIS,
            commObject: { object: this.processes }
          });

          // this.communicationService.announceNewElementArray(
          //     this.analysisService.getElementAsArray(this.collaboration.participant), 'Participant');
          this.communicationService.announce(
            {
              header: AnalysisMessagesHeaders.PARTICIPANT,
              module: Module.ANALYSIS,
              commObject: { object: this.analysisService.getElementAsArray(this.collaboration.participant) }
            });

          this.processes.forEach(
            p => {
              if (typeof p.startEvent !== 'undefined') {
                //                this.communicationService.announceNewElement(p.startEvent, 'StartEvent', p.attr.id);
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.STARTEVENT,
                    module: Module.ANALYSIS,
                    commObject: { object: p.startEvent, relatedToId: p.attr.id }
                  });

              }
              if (typeof p.endEvent !== 'undefined') {
                //                this.communicationService.announceNewElement(p.endEvent, 'EndEvent', p.attr.id);
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.ENDEVENT,
                    module: Module.ANALYSIS,
                    commObject: { object: p.endEvent, relatedToId: p.attr.id }
                  });

              }

              if (typeof p.task !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.STANDARD,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.task),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.sendTask !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.SEND,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.sendTask),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.receiveTask !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.RECEIVE,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.receiveTask),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.manualTask !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.MANUAL,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.manualTask),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.scriptTask !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.SCRIPT,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.scriptTask),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.serviceTask !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.SERVICE,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.serviceTask),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.businessruleTask !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.BUSINESS,
                    module: Module.ANALYSIS,
                    commObject: { object: this.analysisService.getElementAsArray(p.businessruleTask), relatedToId: p.attr.id }
                  });
              }
              if (typeof p.callActivity !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.CALLACTIVITY,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.callActivity),
                      relatedToId: p.attr.id
                    }
                  });
              }

              if (typeof p.complexGateway !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.COMPLEX,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.complexGateway),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.exclusiveGateway !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.EXCLUSIVE,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.exclusiveGateway),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.inclusiveGateway !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.INCLUSIVE,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.inclusiveGateway),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.parallelGateway !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.PARALLEL,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.parallelGateway),
                      relatedToId: p.attr.id
                    }
                  });
              }
              if (typeof p.eventbasedGateway !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.EVENTBASED,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.eventbasedGateway),
                      relatedToId: p.attr.id
                    }
                  });
              }

              if (typeof p.sequenceFlow !== 'undefined') {
                this.communicationService.announce(
                  {
                    header: AnalysisMessagesHeaders.FLOW,
                    module: Module.ANALYSIS,
                    commObject: {
                      object: this.analysisService.getElementAsArray(p.sequenceFlow),
                      relatedToId: p.attr.id
                    }
                  });
              }
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
