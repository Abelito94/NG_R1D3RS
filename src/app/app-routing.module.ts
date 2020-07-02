import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SignComponent } from './pages/signup copy/sign.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign', component: SignComponent },
  { path: 'sign/up', component: SignupComponent },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
