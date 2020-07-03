import { Component, Input } from '@angular/core';
import { APIService } from '../../api.service'
import * as moment from 'moment';
import { Router } from '@angular/router';

type Tweet = {
  userID: any;
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
  myTweets: any[]
  user



  text: string = ""


  constructor(private tweetService: APIService, private router : Router) {
    tweetService.getAllTweets()
      .then(res => this.tweets = res)
      .catch(err => console.log(err))

    this.user = JSON.parse(localStorage.getItem('user'))
    this.tweetService.findEqualUsername(this.user.username)
      .then(fullUser => {
        this.user = fullUser[0]
        localStorage.clear()
        localStorage.setItem('user', JSON.stringify(fullUser[0]))
      })
  }

  filterMyTweets() {
    this.myTweets = this.tweets.filter(tweet => tweet.userID === this.user.id)
  }
  createTweet(text) {
    var newtweet: Tweet = {
      userID: this.user.id,
      text: text,
      creationDate: moment().format(),
      numLikes: 0,
      numRTs: 0
    }
    this.tweetService.createTweet(newtweet)
      .then(res => console.log(res))
      .then(() => {
        this.tweetService.getAllTweets()
          .then(res => this.tweets = res)
          .then(res => this.myTweets = res.filter(tweet => tweet.userID === this.user.id))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    this.text = ''
  }

  logout(){
    localStorage.clear();
   
    this.router.navigate(['sign']); 
  }
}
