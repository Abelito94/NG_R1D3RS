import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SignComponent } from './pages/sign/sign.component';
import { LoginComponent } from './pages/login/login.component';
import { OtherprofileComponent } from './pages/otherprofile/otherprofile.component';


const routes: Routes = [

  { path: '', redirectTo: '/sign', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'sign', component: SignComponent },
  { path: 'sign/up', component: SignupComponent },
  { path: 'login', component: LoginComponent},
  { path: 'home/:username', component: OtherprofileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
