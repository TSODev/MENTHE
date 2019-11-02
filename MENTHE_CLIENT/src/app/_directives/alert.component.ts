import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../_services';

import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;


    constructor(private alertService: AlertService, public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {
            this.message = message;
            if (message != null) {
                this.snackBar.open(message.text, 'Close' , {
                    duration: 2000
                    }
                );
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000,
        });
      }
}
