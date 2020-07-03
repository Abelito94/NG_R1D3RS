import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../../../api.service';

@Component({
  selector: 'app-tweet-alone',
  templateUrl: './tweet-alone.component.html',
  styleUrls: ['./tweet-alone.component.css']
})
export class TweetAloneComponent implements OnInit{
  @Input() tweet;
  @Input() user;
  //userID: string = this.tweet.userID

  constructor(private tweetService: APIService) {}

  async ngOnInit(){
    this.user = await this.tweetService.getUserById(this.tweet.userID);
  }

}
