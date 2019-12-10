import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommunicationMessage} from '../_interfaces/communication.interface';
import { SubSink } from 'subsink';
import { AnalysisService } from './analysis.service';
import { AnalysisMessagesHeaders, ListOfElement} from '../_interfaces/analysis.interface';
import { TaskTypeEnumerated, GatewayTypeFamily, SequenceFlow} from '../_models/bpmn';
import { UserService } from './user.service';
import { PublishingService } from './publishing.service';
import * as _ from 'lodash';
import * as R from 'ramda';
import { PublishMessageHeader, PublishedItem } from '../_interfaces/publish.interface';
import { DBVariableService } from './variable.service';
import { DBProcessService } from './process.service';
import { ProcessState } from '../_models/process';
import { Workflow } from '../_models/workflow';

@Injectable({
  providedIn: 'root'
})


export class CommunicationService {

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
      this.commMessage$.subscribe(
        message => {
          console.log('[MESSAGE] receive :', message);
          this.checkModuleAndHeader(message);
        }
      )
    );

  }

  private checkModuleAndHeader = R.cond([
     [R.pipe(R.prop('module'), R.equals('ANALYSIS')),
              R.cond([
                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.STARTANALYSIS)),
                      (data) =>  this.analysisService.clearElementList()
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.WORKFLOW)),
                      (data) =>  {
                        this.analysisService.addWorkFlowInList(data.commObject.object);
                        this.publishingService.addToPublishList(data.commObject.object, 'Workflow');
                      }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.COLLABORATION)),
                      (data) =>  {
                                  this.analysisService.addCollaborationInList(data.commObject.object);
                                  this.publishingService.addToPublishList(data.commObject.object, 'Collaboration');
                      }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.PROCESS)),
                (data) =>  {
                  const workflow: Workflow = this.analysisService.getElementList().wf;
                  data.commObject.object.forEach(element => {
                                    this.analysisService.addProcessInList(element, workflow.title);
                                    this.dbProcessService.create({
                                                                    workflowId: data.commObject.relatedToId,
                                                                    processId:  workflow.title.concat('_').concat(element.attr.id),
                                                                    name: element.attr.id,
                                                                    status: ProcessState.LOADING,
                                                                }).subscribe();
                                    });
                  this.publishingService.addToPublishList(data.commObject.object, 'Process');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.PARTICIPANT)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addParticipantInList(element);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Participant');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.STARTEVENT)),
                (data) =>  {
                  this.analysisService.addStartEventInList(data.commObject.object);
                  this.publishingService.addToPublishList(data.commObject.object, 'StartEvent');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.ENDEVENT)),
                (data) =>  {
                  this.analysisService.addEndEventInList(data.commObject.object);
                  this.publishingService.addToPublishList(data.commObject.object, 'EndEvent');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.STANDARD)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.STANDARD, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.SEND)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.SEND, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.RECEIVE)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.RECEIVE, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.USER)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.USER, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.SERVICE)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.SERVICE, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.SCRIPT)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.SCRIPT, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.MANUAL)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.MANUAL, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.CALLACTIVITY)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.CALLACTIVITY, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.BUSINESS)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.BUSINESSRULE, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.EVENTBASED)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    this.analysisService.addTaskInList(
                      element, TaskTypeEnumerated.EVENTBASED, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Task');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.COMPLEX)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    R.assoc('type', GatewayTypeFamily.COMPLEX, element);
                    this.analysisService.addGatewayInList(GatewayTypeFamily.COMPLEX, element, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Gateway');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.EXCLUSIVE)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    R.assoc('type', GatewayTypeFamily.EXCLUSIVE, element);
                    this.analysisService.addGatewayInList(GatewayTypeFamily.EXCLUSIVE, element, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Gateway');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.PARALLEL)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    R.assoc('type', GatewayTypeFamily.PARALLEL, element);
                    this.analysisService.addGatewayInList(GatewayTypeFamily.PARALLEL, element, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Gateway');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.INCLUSIVE)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    R.assoc('type', GatewayTypeFamily.INCLUSIVE, element);
                    this.analysisService.addGatewayInList(GatewayTypeFamily.INCLUSIVE, element, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Gateway');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.EVENTBASED)),
                (data) =>  {
                  data.commObject.object.forEach(element => {
                    R.assoc('type', GatewayTypeFamily.EVENTBASED, element);
                    this.analysisService.addGatewayInList(GatewayTypeFamily.EVENTBASED, element, data.commObject.relatedToId);
                  });
                  this.publishingService.addToPublishList(data.commObject.object, 'Gateway');
                }
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.FLOW)),
                (data) =>    data.commObject.object.forEach(
                  element => {
                    this.analysisService.addFlowInList(element as unknown as SequenceFlow);
                    this.publishingService.addToPublishList(data.commObject.object, 'Flow');
                  })
                ],

                [R.pipe(R.prop('header'), R.equals(AnalysisMessagesHeaders.ENDANALYSIS)),
                (data) =>  console.log(AnalysisMessagesHeaders.ENDANALYSIS)
                ],

                [R.T, (data) => console.log('this header is not supported : ', data.header)]
              ])],


      [R.pipe(R.prop('module'), R.equals('PUBLISH')),
          R.cond([
                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.STARTPUBLISHING)),
                  (data) =>  this.publishingService.startPublishing()
                ],

                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.ADDPARTICIPANT)),
                (data) =>  {
                  this.publishingService.addToPublishList(data.commObject.object, PublishedItem.OWNER);
                  this.publishingService.markValidated(ListOfElement.PARTICIPANT);
                }
                ],

                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.CHANGEPARTICIPANT)),
                (data) =>  {
                  this.publishingService.removeFromPublishList(data.commObject.object.old, PublishedItem.OWNER);
                  this.publishingService.addToPublishList(data.commObject.object.new, PublishedItem.OWNER);
                }
                ],

                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.REMOVEPARTICIPANT)),
                (data) =>  console.log(PublishMessageHeader.REMOVEPARTICIPANT, ' ', data.commObject)
                ],

                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.ADDVARIABLE)),
                (data) =>  {
                  this.dbVariableService.create(data.commObject.object).subscribe(
                    response => {
                      this.publishingService.addVariableInPublishList(data.commObject.object);
                    }
                  );
                }
                ],

                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.REMOVEVARIABLE)),
                (data) =>  this.dbVariableService.delete(data.commObject.object.variable_id).subscribe()
                ],


                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.ADDMAPPING)),
                (data) =>  {
                  this.publishingService.addToPublishList(data.commObject.object, PublishedItem.MAPPING);
                  const flows = this.analysisService.getLinkedFlow(data.commObject.relatedToId, this.analysisService.getElementList().flow);
                  flows.forEach(flow => {
                    if (typeof flow.attr !== 'undefined') {
                      flow.attr.mappedTo = data.commObject.object;
                    }
                  });
                  this.publishingService.markValidated(ListOfElement.FLOW);
                  }
                ],

                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.CHANGEMAPPING)),
                (data) =>  {
                  this.publishingService.removeFromPublishList(data.commObject.object.old, PublishedItem.MAPPING);
                  this.publishingService.addToPublishList(data.commObject.object.new, PublishedItem.MAPPING);
                  const flows = this.analysisService.getLinkedFlow(
                                  data.commObject.relatedToId, this.analysisService.getElementList().flow
                    );
                  flows.forEach(flow => {
                    if (typeof flow.attr !== 'undefined') {
                      flow.attr.mappedTo = data.commObject.object.new;
                    }
                  });
                }
                ],

                [R.pipe(R.prop('header'), R.equals(PublishMessageHeader.ALIAS)),
                (data) =>  this.publishingService.addToPublishList(data.commObject.object, PublishedItem.ALIAS)
                ],

                [R.T, (data) => console.log('this header is not supported : ', data.header)]
              ])],

      [R.T, R.always('This module does not exist !')]
   ]);

  public closeService() {
    this.subs.unsubscribe();
  }

  public announce(message: CommunicationMessage) {
    //    console.log('[MESSAGE] Announce new object ', message);
    this.commMessageSource.next(message);
  }

}
