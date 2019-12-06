import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { AnalysisService } from './_services/analysis.service';
//import { Process, Participant, Task, GenericGateway, SequenceFlow } from './_models/bpmn';
import { SubSink } from 'subsink';
import { CommunicationService } from './_services/communication.service';
import { PublishingService } from './_services/publishing.service';
import { PublishList } from './_interfaces/publish.interface';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'menthe';
  publication: PublishList[] = [];

  subs = new SubSink();

  subscription: Subscription;

  // private ProcessList: Process[] = [];
  // private ParticipantList: Participant[] = [];
  // private TaskList: Task[] = [];
  // private GatewayList: GenericGateway[] = [];
  // private FlowList: SequenceFlow[] = [];

  // public ElementList = {
  //   processes:  this.ProcessList,
  //   participants: this.ParticipantList,
  //   tasks:  this.TaskList,
  //   gateways: this.GatewayList,
  //   flows: this.FlowList
  // };


  constructor(
      private router: Router,
      private analysisService: AnalysisService,
      private communicationService: CommunicationService,
      private publishingService: PublishingService,
      ) {

    this.subs.add(
      this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    })
    );

    this.subs.add(
      this.publishingService.toBePublished$.subscribe(
        data => {
          this.publication.push(data);
          console.log('[PUBLISH]', this.publication);
        }
      )

    );

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.analysisService.closeService();
    this.communicationService.closeService();
    this.publishingService.closeService();
  }
}
