import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AnalysisService } from './_services/analysis.service';
import { SubSink } from 'subsink';
import { CommunicationService } from './_services/communication.service';
import { PublishingService } from './_services/publishing.service';
import { Publication } from './_interfaces/publish.interface';
import { MatDialog } from '@angular/material';
import { PublishdialogComponent } from './workflow/publishing/publishdialog/publishdialog.component';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'menthe';
  publication: Publication[] = [];

  subs = new SubSink();

  constructor(
      private router: Router,
      private analysisService: AnalysisService,
      private communicationService: CommunicationService,
      private publishingService: PublishingService,
      public dialog: MatDialog,
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
        }
      )
    );

    this.subs.add(
        this.publishingService.publishIsDone$.subscribe(
          done => {
            if ( done ) {
               const dialogRef = this.dialog.open(PublishdialogComponent, {
                width: '500px',
                data: '',
              });

               dialogRef.afterClosed().subscribe(result => {
                if (typeof result !== 'undefined') {
                  if (result === 'OK') {
                    this.publishingService.publish(this.publication);
                    this.router.navigate(['/home']);
                  }
                }
              });

               }
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
