import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../../../api.service';
import { Router } from '@angular/router';
import { TweetComponent } from '../../tweet/tweet.component';

@Component({
  selector: 'app-tweet-alone',
  templateUrl: './tweet-alone.component.html',
  styleUrls: ['./tweet-alone.component.css']
})
export class TweetAloneComponent implements OnInit{
  @Input() tweet;
  @Input() user;
  //userID: string = this.tweet.userID
  
  constructor(private tweetService: APIService, private router : Router) {}

  async ngOnInit(){
    this.user = await this.tweetService.getUserById(this.tweet.userID);
  }
  //para comparar en la vista y dibujare el username...
  myuser = JSON.parse(localStorage.getItem('user'));
}
