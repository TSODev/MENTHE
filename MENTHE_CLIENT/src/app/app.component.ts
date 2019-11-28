import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { AnalysisService } from './_services/analysis.service';
//import { Process, Participant, Task, GenericGateway, SequenceFlow } from './_models/bpmn';
import { SubSink } from 'subsink';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'menthe';

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
      private analysisService: AnalysisService
      ) {
    this.subs.add(
        this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    })
    );

    // this.subs.add(
    //   this.analysisService.newElementAnnounced$.subscribe(
    //     data => {
    //       console.log('[COMMUNICATION] : ', data.type , ' > ', data.object);
    //       switch (data.type) {
    //         case 'Process': this.ProcessList.push(data.object as unknown as Process);
    //                         break;
    //         case 'Participant': this.ParticipantList.push(data.object as unknown as Participant);
    //                             break;
    //         case 'Task': this.TaskList.push(data.object as unknown as Task);
    //                      break;
    //         case 'Gateway': this.GatewayList.push(data.object as unknown as GenericGateway);
    //                         break;
    //         case 'SequenceFlow': this.FlowList.push(data.object as unknown as SequenceFlow);
    //                              break;
    //       }
    //       console.log('[LIST] : ', this.ElementList);
    //     })
    //   );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
