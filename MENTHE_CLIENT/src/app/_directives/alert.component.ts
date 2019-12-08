import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../_services';

import {MatSnackBar} from '@angular/material';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
//    message: any;

    subs = new SubSink();

    constructor(
                  private alertService: AlertService,
                  public snackBar: MatSnackBar
      ) { }

    ngOnInit() {
        this.subs.add(
          this.alertService.getMessage().subscribe(
            message => {
//              this.message = message;
              if (message != null) {
                  this.snackBar.open(message.text, 'Close' , {
                      duration: 5000
                      }
                  );
              }
            }
        )
        );
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000,
        });
      }
}
