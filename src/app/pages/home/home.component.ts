import { Component, Input } from '@angular/core';
import { APIService } from '../../api.service'
import * as moment from 'moment';

type Tweet = {
  userId: string;
  id: number;
  text: string;
  creationDate: string;
  numLikes: number;
  numRTs: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  tweets: any[] = []


  newtweet: Tweet = {
    userId: "",
    id: 0,
    text: "",
    creationDate: "",
    numLikes: 0,
    numRTs: 0
  }
  text: string = ""

  constructor(private tweetService: APIService) { }

  getTweet() {
    this.tweetService.getAllTweets()
      .then(res => this.tweets = res)
      .catch(err => console.log(err))
  }
  createTweet(text) {

    this.newtweet.text = text
    this.newtweet.creationDate = moment().format('MMMM Do YYYY, h:mm:ss a')
    this.tweetService.createTweet(this.newtweet)
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }
}
