import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommunicationMessage, CommunicationMessageHeader, Module } from '../_interfaces/communication.interface';
import { SubSink } from 'subsink';
import { AnalysisService } from './analysis.service';
import { MenthePhase, Message, AnalysisMessagesHeaders } from '../_interfaces/analysis.interface';
import { GenericGateway, TaskTypeEnumerated, GatewayTypeFamily, SequenceFlow } from '../_models/bpmn';
import { UserService } from './user.service';
import { PublishingService } from './publishing.service';
import * as _ from 'lodash';
import { PublishMessageHeader } from '../_interfaces/publish.interface';

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
            case Module.COMMUNICATION: break;
            case Module.ANALYSIS: {
              switch (message.header) {
                case AnalysisMessagesHeaders.STARTANALYSIS: this.analysisService.clearElementList();
                                                            break;
                case AnalysisMessagesHeaders.COLLABORATION:
                  this.analysisService.addCollaborationInList(message.commObject.object);
                  break;
                case AnalysisMessagesHeaders.PROCESS:
                  message.commObject.object.forEach(element =>
                    this.analysisService.addProcessInList(element));
                  break;
                case AnalysisMessagesHeaders.PARTICIPANT:
                  message.commObject.object.forEach(element =>
                    this.analysisService.addParticipantInList(element));
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
                    this.analysisService.addGatewayInList(gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.EXCLUSIVE:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.EXCLUSIVE;
                    this.analysisService.addGatewayInList(gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.INCLUSIVE:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.INCLUSIVE;
                    this.analysisService.addGatewayInList(gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.EVENTBASED:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.EVENTBASED;
                    this.analysisService.addGatewayInList(gate, message.commObject.relatedToId);
                  });
                  break;
                case AnalysisMessagesHeaders.PARALLEL:
                  message.commObject.object.forEach(element => {
                    gate = element;
                    gate.type = GatewayTypeFamily.PARALLEL;
                    this.analysisService.addGatewayInList(gate, message.commObject.relatedToId);
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
                case PublishMessageHeader.ADDPARTICIPANT:
                  //                    console.log(PublishMessageHeader.ADDPARTICIPANT, ' ', message.commObject);
                  this.publishingService.addToPublishList(message.commObject.object, 'Owner');
                  console.log(this.publishingService.getPublishList());
                  break;
                case PublishMessageHeader.CHANGEPARTICIPANT:
                  //                    console.log(PublishMessageHeader.CHANGEPARTICIPANT, ' ', message.commObject);
                  this.publishingService.removeFromPublishList(message.commObject.object, 'Owner');
                  console.log(this.publishingService.getPublishList());
                  break;
                case PublishMessageHeader.REMOVEPARTICIPANT:
                  console.log(PublishMessageHeader.REMOVEPARTICIPANT, ' ', message.commObject);
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
