import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './mainpage/home';
import { LoginComponent } from './session/login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { MainNavComponent } from './mainpage/main-nav/main-nav.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { GroupadminComponent } from './admin/groupadmin/groupadmin.component';
import { AccountadminComponent } from './admin/accountadmin/accountadmin.component';
import { DisconnectComponent } from './session/disconnect/disconnect.component';
import { MainDashComponent } from './mainpage/main-dash/main-dash.component';
import { ModelerComponent } from './workflow/modeler/modeler.component';
import { ViewerComponent } from './workflow/viewer/viewer.component';
import { AnalysisComponent } from './workflow/analysis/analysis.component';
import { UserBoardComponent } from './admin/userboard/userboard.component';

const appRoutes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    { path: 'Accountadmin', component: UserBoardComponent, canActivate: [AuthGuard]},
    { path: 'Groupadmin', component: GroupadminComponent, canActivate: [AuthGuard]},
    { path: 'disconnect', component: DisconnectComponent},
    { path: 'dashboard', component: MainDashComponent},
    { path: 'workflow/create', component: ModelerComponent},
    { path: 'workflow/edit/:id', component: ModelerComponent},
    { path: 'workflow/view/:id', component: ViewerComponent},
    { path: 'workflow/analysis/:id', component: AnalysisComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
