import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
          MatExpansionModule,
          MatSelectModule,
          MAT_DIALOG_DEFAULT_OPTIONS,
          MatDialogModule,
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
import { WorkflowfilterPipe } from './_pipes/workflowfilter.pipe';
import { UserfilterPipe } from './_pipes/userfilter.pipe';
import { AnalysisComponent } from './workflow/analysis/analysis.component';
import { TaskComponent } from './workflow/analysis/task/task.component';
import { OutgoingComponent } from './workflow/analysis/outgoing/outgoing.component';
import { StartEventComponent } from './workflow/analysis/start-event/start-event.component';
import { EndEventComponent } from './workflow/analysis/end-event/end-event.component';
import { ProcessComponent } from './workflow/analysis/process/process.component';
import { CollaborationComponent } from './workflow/analysis/collaboration/collaboration.component';
import { ParticipantComponent } from './workflow/analysis/participant/participant.component';
import { ParallelComponent } from './workflow/analysis/gateways/parallel/parallel.component';
import { IncomingComponent } from './workflow/analysis/incoming/incoming.component';
import { ExclusiveComponent } from './workflow/analysis/gateways/exclusive/exclusive.component';
import { InclusiveComponent } from './workflow/analysis/gateways/inclusive/inclusive.component';
import { ComplexComponent } from './workflow/analysis/gateways/complex/complex.component';
import { EventbasedComponent } from './workflow/analysis/gateways/eventbased/eventbased.component';
import { VariableComponent } from './workflow/publishing/variable/variable.component';
import { VariableGridComponent } from './workflow/publishing/variable-grid/variable-grid.component';
import { DBVariableService } from './_services/variable.service';
import { DBProcessService } from './_services/process.service';
import { BasicviewerComponent } from './workflow/viewer/basicviewer/basicviewer.component';
import { AutofocusDirective } from './_directives/autofocus.directive';
import { UserBoardComponent } from './admin/userboard/userboard.component';
import { UsereditdialogComponent } from './admin/accountadmin/usereditdialog/usereditdialog.component';

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
    WorkflowfilterPipe,
    UserfilterPipe,
    AnalysisComponent,
    TaskComponent,
    OutgoingComponent,
    StartEventComponent,
    EndEventComponent,
    ProcessComponent,
    CollaborationComponent,
    ParticipantComponent,
    ParallelComponent,
    IncomingComponent,
    ExclusiveComponent,
    InclusiveComponent,
    ComplexComponent,
    EventbasedComponent,
    VariableComponent,
    VariableGridComponent,
    BasicviewerComponent,
    AutofocusDirective,
    UserBoardComponent,
    UsereditdialogComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
  ],

  entryComponents: [
    UsereditdialogComponent,
  ],

  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    ArticleService,
    CookieService,
    WorkflowService,
    DBVariableService,
    DBProcessService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
