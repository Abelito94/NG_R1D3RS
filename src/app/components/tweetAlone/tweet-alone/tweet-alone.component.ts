import { Component, Input } from '@angular/core';
import { APIService } from '../../api.service';

@Component({
  selector: 'app-tweet-alone',
  templateUrl: './tweet-alone.component.html',
  styleUrls: ['./tweet-alone.component.css']
})
export class TweetAloneComponent {
  @Input() tweet: Object
  userID: string = this.tweet.userID
  user: Object 


  constructor(private tweetService: APIService) {

    tweetService.getUserById(this.userID)
      .then(res => this.user = res)
      .catch(err => console.log(err))

  }

}
