import { Directive, TemplateRef, ViewContainerRef, Input, OnDestroy} from '@angular/core';
import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { SubSink } from 'subsink';

@Directive({
  selector: '[rbacAllow]'
})
export class  RbacAllowDirective implements OnDestroy {

  allowedRoles: string[];
  user: User;

  subs = new SubSink();

  sub: Subscription;

    constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private authService: AuthenticationService) {

        // this.sub = authService.user$.subscribe(
        //   user => {
        //     this.user = user;
        //     this.showIfUserAllowed();
        //   }
        // );

        // this.sub = this.authService.getAuthenticatedUser().subscribe(
        //     user => {
        //       this.user = user;
        //       this.showIfUserAllowed();
        //     }
        // );

      //  this.user = JSON.parse(localStorage.getItem('currentUser'));

      this.subs.add(
        this.authService.getLoggedUser()
          .subscribe(user => {
            return this.user = user;
          } )
      );

      }

    ngOnDestroy() {
      this.subs.unsubscribe();
//      this.sub.unsubscribe();
    }

    @Input()
    set rbacAllow(allowedRoles: string[]) {
        this.allowedRoles = allowedRoles;
        this.showIfUserAllowed();
    }

    showIfUserAllowed() {

      if (!this.allowedRoles || this.allowedRoles.length === 0 || !this.user) {
        this.viewContainer.clear();
        return;
      }

      const isUserAllowed = _.intersection(this.allowedRoles, this.user.roles).length > 0;
      if (isUserAllowed) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
}

