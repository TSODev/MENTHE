import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './session/login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { MainNavComponent } from './main-nav/main-nav.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { GroupadminComponent } from './admin/groupadmin/groupadmin.component';
import { AccountadminComponent } from './admin/accountadmin/accountadmin.component';
import { DisconnectComponent } from './session/disconnect/disconnect.component';
import { MainDashComponent } from './main-dash/main-dash.component';

const appRoutes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    { path: 'Accountadmin', component: AccountadminComponent, canActivate: [AuthGuard]},
    { path: 'Groupadmin', component: GroupadminComponent, canActivate: [AuthGuard]},
    { path: 'disconnect', component: DisconnectComponent},
    { path: 'dashboard', component: MainDashComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
