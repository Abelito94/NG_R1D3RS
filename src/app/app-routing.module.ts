import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SignComponent } from './pages/sign/sign.component';
import { LoginComponent } from './pages/login/login.component';
import { OtherprofileComponent } from './pages/otherprofile/otherprofile.component';
import { AuthGuard } from './guards/auth.guard';
import { QuickLogGuard } from './guards/quick-log.guard';
import { EditComponent } from './edit/edit.component';
import { HomeFollowingTweetsComponent } from './pages/home-following-tweets/home-following-tweets.component';
import { HomeMyTweetsComponent } from './pages/home-my-tweets/home-my-tweets.component';


const routes: Routes = [

  { path: '', redirectTo: '/sign', pathMatch: 'full', canActivate: [QuickLogGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'sign', component: SignComponent, canActivate: [QuickLogGuard] },
  { path: 'sign/up', component: SignupComponent, canActivate: [QuickLogGuard] },
  { path: 'login', component: LoginComponent, canActivate: [QuickLogGuard]},
  { path: 'home/:username', component: OtherprofileComponent, canActivate: [AuthGuard]},
  { path:'profile/edit', component:EditComponent, canActivate: [AuthGuard]},
  { path: 'followingtweets', component: HomeFollowingTweetsComponent, canActivate: [AuthGuard]},
  { path: 'mytweets', component: HomeMyTweetsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
