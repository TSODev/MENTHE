import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { ApiRequestInterceptor } from './_helpers/apirequest.interceptor';
import { AlertService, AuthenticationService, UserService } from './_services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
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
          MatBadgeModule
        } from '@angular/material';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MainDashComponent } from './main-dash/main-dash.component';

import { CookieService } from 'ngx-cookie-service';
import { AccountadminComponent } from './admin/accountadmin/accountadmin.component';
import { GroupadminComponent } from './admin/groupadmin/groupadmin.component';
import { AccountComponent } from './admin/account/account.component';

import { RbacAllowDirective } from './_directives/rbacAllow.directive';

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
    AccountComponent,
    RbacAllowDirective,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    MatGridListModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
