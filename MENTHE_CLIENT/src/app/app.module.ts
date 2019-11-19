import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { ApiRequestInterceptor } from './_helpers/apirequest.interceptor';
import { AlertService, AuthenticationService, UserService } from './_services';
import { ArticleService } from './_services/article.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './session/login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './mainpage/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';


import { MatInputModule,
          MatFormFieldModule,
          MatButtonModule,
          MatCardModule,
          MatToolbarModule,
          MatSidenavModule,
          MatIconModule,
          MatListModule,
          MatMenuModule,
          MatProgressBarModule,
          MatProgressSpinnerModule,
          MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatGridListModule,
          MatBadgeModule,
        } from '@angular/material';
import { MainNavComponent } from './mainpage/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MainDashComponent } from './mainpage/main-dash/main-dash.component';

import { CookieService } from 'ngx-cookie-service';
import { AccountadminComponent } from './admin/accountadmin/accountadmin.component';
import { GroupadminComponent } from './admin/groupadmin/groupadmin.component';

import { RbacAllowDirective } from './_directives/rbacAllow.directive';
import { DisconnectComponent } from './session/disconnect/disconnect.component';
import 'hammerjs';
import { ModelerComponent } from './workflow/modeler/modeler.component';
import { WorkflowService } from './_services/workflow.service';
import { WfcardComponent } from './mainpage/wfcard/wfcard.component';
import { SvgimageComponent } from './mainpage/svgimage/svgimage.component';
import { ViewerComponent } from './workflow/viewer/viewer.component';
import { CallbackPipe } from './_pipes/callback.pipe';
import { DashfilterPipe } from './_pipes/dashfilter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MainNavComponent,
    UserProfileComponent,
    MainDashComponent,
    AccountadminComponent,
    GroupadminComponent,
    RbacAllowDirective,
    DisconnectComponent,
    ModelerComponent,
    WfcardComponent,
    SvgimageComponent,
    ViewerComponent,
    CallbackPipe,
    DashfilterPipe,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    routing,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    ArticleService,
    CookieService,
    WorkflowService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
