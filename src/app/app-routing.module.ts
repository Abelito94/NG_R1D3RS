import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SignComponent } from './pages/sign/sign.component';
import { LoginComponent } from './pages/login/login.component';
import { OtherprofileComponent } from './pages/otherprofile/otherprofile.component';
import { EditComponent } from './edit/edit.component';
import { HomeFollowingTweetsComponent } from './pages/home-following-tweets/home-following-tweets.component';
import { HomeMyTweetsComponent } from './pages/home-my-tweets/home-my-tweets.component';


const routes: Routes = [

  { path: '', redirectTo: '/sign', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'sign', component: SignComponent },
  { path: 'sign/up', component: SignupComponent },
  { path: 'login', component: LoginComponent},
  { path: 'home/:username', component: OtherprofileComponent},
  { path:'profile/edit', component:EditComponent},
  { path: 'followingtweets', component: HomeFollowingTweetsComponent },
  { path: 'mytweets', component: HomeMyTweetsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
