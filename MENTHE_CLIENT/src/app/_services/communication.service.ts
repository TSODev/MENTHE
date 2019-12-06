import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommunicationMessage, CommunicationMessageHeader, Module } from '../_interfaces/communication.interface';
import { SubSink } from 'subsink';
import { AnalysisService } from './analysis.service';
import { MenthePhase, Message, AnalysisMessagesHeaders, MentheStep } from '../_interfaces/analysis.interface';
import { GenericGateway, TaskTypeEnumerated, GatewayTypeFamily, SequenceFlow, Process } from '../_models/bpmn';
import { UserService } from './user.service';
import { PublishingService } from './publishing.service';
import * as _ from 'lodash';
import { PublishMessageHeader } from '../_interfaces/publish.interface';
import { DBVariableService } from './variable.service';
import { DBProcessService } from './process.service';
import { ProcessState } from '../_models/process';
import { WfcardComponent } from '../mainpage/wfcard/wfcard.component';
import { Workflow } from '../_models/workflow';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private newPublishInfoSource = new Subject<Message>();
  public newPublishInfoAnnounced$ = this.newPublishInfoSource.asObservable();

  private commMessageSource = new Subject<CommunicationMessage>();
  public commMessage$ = this.commMessageSource.asObservable();

  subs = new SubSink();

  constructor(
    private analysisService: AnalysisService,
    private userService: UserService,
    private publishingService: PublishingService,
    private dbVariableService: DBVariableService,
    private dbProcessService: DBProcessService,
  ) {

    this.subs.add(
      this.newPublishInfoAnnounced$.subscribe(
        data => {
          console.log('[COMMUNICATION]', data);
          switch (data.type) {
            case 'AddOwner': this.userService.getUserById(data.object['selectedUser']).subscribe(
              found => {
                console.log('Need to publish user participant : ', found);
                this.publishingService.addToPublishList(found, 'Owner');
              }
            );
                             break;
            case 'RemoveOwner': this.userService.getUserById(data.object['selectedUser']).subscribe(
              found => {
                console.log('Need to remove published user participant : ', found);
                this.publishingService.removeFromPublishList(found, 'Owner');
              }
            );
                                break;
          }
        }
      )
    );

    this.subs.add(
      this.commMessage$.subscribe(
        message => {
          console.log('[MESSAGE] receive :', message);
          const processId = message.commObject.relatedToId;
          let gate: GenericGateway;
          switch (message.module) {
            case Module.COMMUNICATION:
//               switch (message.header) {
//                 case CommunicationMessageHeader.COMMUNICATION:
//                   switch (message.commObject.object.phase) {
//                     case (MenthePhase.PUBLISH):
// //                        if (message.commObject.object.step === MentheStep.START) {
//                           console.log('[COMMUNICATION] ElementList : ', this.analysisService.ElementList);
// //                        }
//                           break;
//                   }
//                   break;
//               }
              break;
            case Module.ANALYSIS: {
              switch (message.header) {
                case AnalysisMessagesHeaders.STARTANALYSIS: this.analysisService.clearElementList();
                                                            break;
                case AnalysisMessagesHeaders.WORKFLOW:
                  this.analysisService.addWorkFlowInList(message.commObject.object);
                  break;
                case AnalysisMessagesHeaders.COLLABORATION:
                  this.analysisService.addCollaborationInList(message.commObject.object);
                  break;
                case AnalysisMessagesHeaders.PROCESS:
                  const workflow: Workflow = this.analysisService.getElementList().wf;
                  message.commObject.object.forEach(element => {
                                    this.analysisService.addProcessInList(element, workflow.title);
                                    this.dbProcessService.create({
                                                                    workflowId: message.commObject.relatedToId,
                                                                    processId:  workflow.title.concat('_').concat(element.attr.id),
                                                                    name: element.attr.id,
                                                                    status: ProcessState.LOADING,
                                                                }).subscribe();
                                    });
                  break;
                case AnalysisMessagesHeaders.PARTICIPANT:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addParticipantInList(element);
                  });
                  break;
                case AnalysisMessagesHeaders.STARTEVENT:
                  this.analysisService.addStartEventInList(message.commObject.object);
                  break;
                case AnalysisMessagesHeaders.ENDEVENT:
                  this.analysisService.addEndEventInList(message.commObject.object);
                  break;
                case AnalysisMessagesHeaders.STANDARD:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.STANDARD, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.SEND:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.SEND, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.RECEIVE:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.RECEIVE, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.USER:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.USER, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.SERVICE:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.SERVICE, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.SCRIPT:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.SCRIPT, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.MANUAL:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.MANUAL, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.CALLACTIVITY:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.CALLACTIVITY, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.BUSINESS:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.BUSINESSRULE, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.EVENTBASED:
                  message.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.EVENTBASED, processId);
                  });
                  break;
                case AnalysisMessagesHeaders.COMPLEX:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.COMPLEX;
                    this.analysisService.addGatewayInList(GatewayTypeFamily.COMPLEX, gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.EXCLUSIVE:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.EXCLUSIVE;
                    this.analysisService.addGatewayInList(GatewayTypeFamily.EXCLUSIVE, gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.INCLUSIVE:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.INCLUSIVE;
                    this.analysisService.addGatewayInList(GatewayTypeFamily.INCLUSIVE, gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.EVENTBASED:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.EVENTBASED;
                    this.analysisService.addGatewayInList(GatewayTypeFamily.EVENTBASED, gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.PARALLEL:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.PARALLEL;
                    this.analysisService.addGatewayInList(GatewayTypeFamily.PARALLEL, gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.FLOW:
                  message.commObject.object.forEach(element =>
                    this.analysisService.addFlowInList(element as unknown as SequenceFlow));
                  break;

              }
            }
                                  break;




            case Module.PUBLISH: {
              switch (message.header) {
                case PublishMessageHeader.STARTPUBLISHING:
                    console.log('[PUBLISHING] ElementList : ', this.analysisService.ElementList);
                    break;
                case PublishMessageHeader.ADDPARTICIPANT:
                  //                    console.log(PublishMessageHeader.ADDPARTICIPANT, ' ', message.commObject);
                  this.publishingService.addToPublishList(message.commObject.object, 'Owner');
//                  console.log(this.publishingService.getPublishList());
                  break;
                case PublishMessageHeader.CHANGEPARTICIPANT:
                  //                    console.log(PublishMessageHeader.CHANGEPARTICIPANT, ' ', message.commObject);
                  this.publishingService.removeFromPublishList(message.commObject.object.old, 'Owner');
                  this.publishingService.addToPublishList(message.commObject.object.new, 'Owner');
//                  console.log(this.publishingService.getPublishList());
                  break;
                case PublishMessageHeader.REMOVEPARTICIPANT:
                  console.log(PublishMessageHeader.REMOVEPARTICIPANT, ' ', message.commObject);
                  break;
                case PublishMessageHeader.ADDVARIABLE:
//                  message.commObject.object.workflowId = this.analysisService.getElementList().wf.workflow_id;
                  this.dbVariableService.create(message.commObject.object).subscribe(
                    response => {
                      this.publishingService.addVariableInPublishList(message.commObject.object);
                    }
                  );
                  break;
                case PublishMessageHeader.ADDMAPPING:
                  this.publishingService.addToPublishList(message.commObject.object, 'Mapping');
                  break;
                case PublishMessageHeader.CHANGEMAPPING:
                  this.publishingService.removeFromPublishList(message.commObject.object.old, 'Mapping');
                  this.publishingService.addToPublishList(message.commObject.object.new, 'Mapping');
                  break;
                case PublishMessageHeader.ALIAS:
                  this.publishingService.addToPublishList(message.commObject, 'Alias');
                  break;

              }
            }
break;
          }

        }
      )
    );

  }


closeService() {
    this.subs.unsubscribe();
  }

announce(message: CommunicationMessage) {
    //    console.log('[MESSAGE] Announce new object ', message);
    this.commMessageSource.next(message);
  }

announceNewPublishInfo(element: any, elementType) {
    console.log('[COMMUNICATION] Publish annouce a new', elementType, '  ', element);
    const message: Message = { object: element, type: elementType };
    this.newPublishInfoSource.next(message);
  }


}
