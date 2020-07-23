import { Component, OnInit, Input } from '@angular/core';
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
  page = 1


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
        this.tweetService.getAllTweets(this.page)
          .then(res => {
            res.forEach(element => {
              element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
            })
            res = res.filter(tweet => !tweet.isRt)
            return res
          })
          .then(res => {
            //all tweets
            this.tweets = res;
          })
          .catch(err => console.log(err))
      })
  }

  deleteTweet(tweetId) {
    this.tweetService.eraseTweet(tweetId).then(() => {
      this.tweets = this.tweets.filter(tweet => tweetId != tweet.id)
      this.myTweets = this.myTweets.filter(tweet => tweetId != tweet.id)
    })
  }
  //infinityScrollTweets

  onScrollDown(ev) {
    this.page++
    this.direction = 'down'
    this.generateTweet();
  }

  async generateTweet() {
    var res = await this.tweetService.getAllTweets(this.page)
    res.forEach(element => {
      element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
    })
    res = res.filter(tweet => !tweet.isRt)
    this.tweets.push(...res)
    return res
  }

  like(tweet) {
    this.tweetService.gettweetsByUser(this.page, tweet.userID)
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

  disLike(tweet) {
    this.tweetService.gettweetsByUser(this.page, tweet.userID)
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

  retweet(tweet) {
    let newnumRTs = {}
    var tweetId = ''


    if (tweet.isRt) {
      newnumRTs = {
        tweet: {
          numRTs: tweet.tweet.numRTs
        }
      }
      tweetId = tweet.tweet.id
    } else {
      // SIEMPRE AQUI
      newnumRTs = {
        numRTs: tweet.numRTs
      }
      tweetId = tweet.id
    }


    this.tweetService.updatenumRTs(tweetId, newnumRTs)
      .then(() => {

        let reTweet = {
          tweet: {
            ...tweet
          },
          creationDate: moment().format(),
          userID: this.user.id,
          isRt: true
        }

        this.tweetService.createTweet(reTweet)
      })
  }

  onretweet(tweet) {

    let newnumRTs = {}
    var tweetId = ''
    let id = []


    if (tweet.isRt) {
      newnumRTs = {
        tweet: {
          numRTs: tweet.tweet.numRTs
        }
      }
      tweetId = tweet.tweet.id
    } else {
      // SIEMPRE AQUI
      newnumRTs = {
        numRTs: tweet.numRTs
      }
      tweetId = tweet.id
    }

    this.tweetService.updatenumRTs(tweetId, newnumRTs)
      .then(() => {
        if (tweet.isRt) {
          this.tweetService.eraseTweet(tweet.id)
        } else {
          this.tweetService.gettweetsByUser2(this.user.id)
            .then(res => {

              id = res.filter(elem => {
                if (elem.tweet) {
                  return elem.tweet.id === tweet.id
                }
              })
              console.log(id);
              this.tweetService.eraseTweet(id[0].id)
                  .then(response => console.log(response))
            }
              // .then(() => {
              //   console.log(id);
              //   this.tweetService.eraseTweet(id[0].id)
              //     .then(response => console.log(response))
              // })
            )
        }
      })
  }

}
