import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';

import { HttpClientModule } from '@angular/common/http';

import { FileUploadModule } from 'ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TweetComponent } from './components/tweet/tweet.component';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { SignComponent } from './pages/sign/sign.component';
import { TweetAloneComponent } from './components/tweetAlone/tweet-alone/tweet-alone.component';
import{ SidebarComponent } from './components/sidebar/sidebar.component';
import { OtherprofileComponent } from './pages/otherprofile/otherprofile.component';
import { OtherprofileUserComponent } from './components/otherprofile-user/otherprofile-user.component';

@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    SignComponent,
    TweetAloneComponent,
    SidebarComponent,
    OtherprofileComponent,
    OtherprofileUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'cloudinaryapps', upload_preset: 'firstapp' }),
    FileUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
