import { Component, OnInit, Input } from '@angular/core';
import { APIService } from '../../api.service'
import * as moment from 'moment';
import { Router } from '@angular/router';


type Tweet = {
  userID: any;
  text: string;
  creationDate: string;
  numLikes: Array<number>;
  numRTs: number;
  urlTweet: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  tweets: any[] = []
  myTweets: any[]
  followingtweets: any[] = [];
  user
  text: string = '';
  expanded = false;

  //Infinity Scroll
  throttle = 300;
  scrollDistance = 1;
  direction = '';
  modalOpen = false;
  sum = 1


  constructor(private tweetService: APIService, private router: Router) {
  }

  createTweet(tweetInfo) {
    var newtweet: Tweet = {
      userID: this.user.id,
      text: tweetInfo.text,
      creationDate: moment().format(),
      numLikes: [],
      numRTs: 0,
      urlTweet: tweetInfo.imgUrl || ""
    }
    this.tweetService.createTweet(newtweet)
      .then(res => console.log(res))
      .then(() => {
        this.tweetService.getAllTweets(1)
          .then(res => {
            res.forEach(element => {
              element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
            })
            return res
          })
          .then(res => this.tweets = res)
          .then(res => this.myTweets = res.filter(tweet => tweet.userID === this.user.id))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['sign']);
  }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('user'))
    this.tweetService.findEqualUsername(this.user.username)
      .then(fullUser => {
        this.user = fullUser[0]
        localStorage.clear()
        localStorage.setItem('user', JSON.stringify(fullUser[0]))
      })
      .then(() => {
        this.tweetService.getAllTweets(this.sum)
          .then(res => {
            res.forEach(element => {
              element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
            })
            return res
          })
          .then(res => {
            //all tweets
            this.tweets = res;

            //my tweets
            this.myTweets = res.filter(tweet => tweet.userID === this.user.id);
            //my following tweets
            this.tweetService.getFollowingTweets(this.user.following)
              .then(matrizTweets => {
                matrizTweets.map(arrayTweets => {
                  arrayTweets.data.forEach(tweets => this.followingtweets.push(tweets));
                })
                this.followingtweets.sort(function (a, b) {
                  var dateA = new Date(a.creationDate).getTime();
                  var dateB = new Date(b.creationDate).getTime();
                  return dateA < dateB ? 1 : -1;
                })
                this.followingtweets.forEach(element => {
                  element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
                })
              })
          })
          .catch(err => console.log(err))
      })
  }

  deleteTweet(tweetId) {
    this.tweetService.eraseTweet(tweetId).then(response => {
      this.tweets = this.tweets.filter(tweet => tweetId != tweet.id)
      this.myTweets = this.myTweets.filter(tweet => tweetId != tweet.id)
    })
  }
  //infinityScroll

  onScrollDown(ev) {
    console.log('scrolled down!!', ev);
    this.sum++
    this.direction = 'down'
    this.generateTweet();
  }

  async generateTweet() {
    var res = await this.tweetService.getAllTweets(this.sum)
    res.forEach(element => {
      element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
    })
    this.tweets.push(...res)
    console.log(res)
    console.log(this.tweets);
    return res
  }

  async like(tweet) {
    await this.tweetService.gettweetsByUser(tweet.userID)
    .then( response =>{
      response.forEach(resp =>{
        if(resp.id == tweet.id){
          tweet.numLikes.push(this.user.id);
          let updateTweet ={
            userID: tweet.userID,
            id: tweet.id,
            text: tweet.text,
            creationDate: resp.creationDate,
            numLikes: tweet.numLikes,
            numRTs: tweet.numRTs
          }
          this.tweetService.updateTweet(updateTweet);
        
        }
      })
    })
  }

  async disLike(tweet) {
    await this.tweetService.gettweetsByUser(tweet.userID)
    .then( response =>{
      response.forEach(resp =>{
        if(resp.id == tweet.id){
          let whereLike = tweet.numLikes.indexOf(this.user.id);
          if (whereLike != -1) {
            tweet.numLikes.splice(whereLike, 1);
            let updateTweet ={
              userID: tweet.userID,
              id: tweet.id,
              text: tweet.text,
              creationDate: resp.creationDate,
              numLikes: tweet.numLikes,
              numRTs: tweet.numRTs
            }
            this.tweetService.updateTweet(updateTweet);
          }
        }
      })
    })
  }

}

