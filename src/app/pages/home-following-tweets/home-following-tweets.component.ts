import { Component } from '@angular/core';
import { APIService } from '../../api.service'
import * as moment from 'moment';
import { Router } from '@angular/router';

type Tweet = {
  userID: any;
  text: string;
  creationDate: string;
  numLikes: Array<number>;
  numRTs: Array<number>;
  urlTweet: string
}

@Component({
  selector: 'app-home-following-tweets',
  templateUrl: './home-following-tweets.component.html',
  styleUrls: ['./home-following-tweets.component.css']
})


export class HomeFollowingTweetsComponent {


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
  page = 1
  end = false

  constructor(private tweetService: APIService, private router: Router) {
  }

  createTweet(tweetInfo) {
    var newtweet: Tweet = {
      userID: this.user.id,
      text: tweetInfo.text,
      creationDate: moment().format(),
      numLikes: [],
      numRTs: [],
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

        //my following tweets
        this.tweetService.getFollowingTweets(this.user.following, this.page)
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
  }

  deleteTweet(tweetId) {
    this.tweetService.eraseTweet(tweetId).then(response => {
      this.tweets = this.tweets.filter(tweet => tweetId != tweet.id)
      this.myTweets = this.myTweets.filter(tweet => tweetId != tweet.id)
    })
  }

  //infinityScrollFollowing
  onScrollDown(ev) {
    this.page++
    this.direction = 'down'
    this.generateFollowingsTweet();
  }

  generateFollowingsTweet() {

    this.tweetService.getFollowingTweets(this.user.following, this.page)
      .then(matrizTweets => {
        matrizTweets.map(arrayTweets => {
          if (arrayTweets.data.length != 0) {
            arrayTweets.data.forEach(tweets => {
              this.followingtweets.push(tweets);
            })
          }else {
            this.end = true
          }
        })
        this.followingtweets.sort(function (a, b) {
          var dateA = new Date(a.creationDate).getTime();
          var dateB = new Date(b.creationDate).getTime();
          return dateA < dateB ? -1 : 1;
        })
        this.followingtweets.forEach(element => {
          if (!element.creationDate.includes(',')) {
            element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
          }
        })
      }
      )
  }


  async like(tweet) {
    await this.tweetService.gettweetsByUser(this.page, tweet.userID)
      .then(response => {
        response.forEach(resp => {
          if (resp.id == tweet.id) {
            tweet.numLikes.push(this.user.id);
            let updateTweet = {
              userID: tweet.userID,
              id: tweet.id,
              text: tweet.text,
              creationDate: resp.creationDate,
              urlTweet: tweet.urlTweet,
              numLikes: tweet.numLikes,
              numRTs: tweet.numRTs
            }
            this.tweetService.updateTweet(updateTweet);

          }
        })
      })
  }

  async disLike(tweet) {
    await this.tweetService.gettweetsByUser(this.page, tweet.userID)
      .then(response => {
        response.forEach(resp => {
          if (resp.id == tweet.id) {
            let whereLike = tweet.numLikes.indexOf(this.user.id);
            if (whereLike != -1) {
              tweet.numLikes.splice(whereLike, 1);
              let updateTweet = {
                userID: tweet.userID,
                id: tweet.id,
                text: tweet.text,
                creationDate: resp.creationDate,
                urlTweet: tweet.urlTweet,
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
