import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../../../api.service';

@Component({
  selector: 'app-tweet-alone',
  templateUrl: './tweet-alone.component.html',
  styleUrls: ['./tweet-alone.component.css']
})
export class TweetAloneComponent implements OnInit{
  @Input() tweet;
  //userID: string = this.tweet.userID
 
  user:any={};

  constructor(private tweetService: APIService) {}

  async ngOnInit(){
    this.user = await this.tweetService.getUserById(this.tweet.userID);
    
  }

}
