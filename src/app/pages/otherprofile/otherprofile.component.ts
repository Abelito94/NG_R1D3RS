import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/api.service';
import * as moment from 'moment';

type Tweet = {
  userID: any;
  text: string;
  creationDate: string;
  numLikes: number;
  numRTs: number;
  urlTweet: string
}

@Component({
  selector: 'app-otherprofile',
  templateUrl: './otherprofile.component.html',
  styleUrls: ['./otherprofile.component.css'],
})
export class OtherprofileComponent implements OnInit {
  text: string = '';

  otherTweets: any[];
  username;
  profileUser;
  following = [];
  user = JSON.parse(localStorage.getItem('user'))

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: APIService
  ) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');

    this.dataService.findEqualUsername(this.username)
      .then(res => {
        this.profileUser = res[0];

        this.dataService.gettweetsByUser(this.profileUser.id)
          .then(res => {
            res.forEach(element => {
              element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment(element.creationDate).format('LT')}`;
            })
            return res
          })
          .then(response => {
            this.otherTweets = response;
          })
      })
  }

  createTweet(tweetInfo) {
    var newtweet: Tweet = {
      userID: this.user.id,
      text: tweetInfo.text,
      creationDate: moment().format(),
      numLikes: 0,
      numRTs: 0,
      urlTweet: tweetInfo.imgUrl || ""
    }
    this.dataService.createTweet(newtweet)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  toHome() {
    this.router.navigateByUrl('/home');
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['sign']);
  }

  async addFollows(userFollower) {
    this.user = JSON.parse(localStorage.getItem('user'));

    await this.dataService.findEqualUsername(userFollower.username)
      .then(response => {

        let hastFollower = response[0].followers.some(fwer => fwer == this.user.id);

        if (hastFollower == false) {
          response[0].followers.push(this.user.id);
        }
        //Update api of profileUser...
        this.dataService.updateFollows(response[0])
          .then(() => {
            this.dataService.findEqualUsername(this.user.username)
              .then(response => {
                let hastFollowing = response[0].following.some(fwing => fwing == userFollower.id);
                if (hastFollowing == false) {
                  response[0].following.push(userFollower.id);
                }
                //Update api of local profileUser...
                this.dataService.updateFollows(response[0]);
                //reload page...
                this.dataService.findEqualUsername(this.username)
                  .then(res => {
                    this.user.following.push(userFollower.id)
                    this.profileUser = res[0];
                  })

              })
          })
      })
  }

  async deleteFollows(userFollower) {
    this.user = JSON.parse(localStorage.getItem('user'));

    await this.dataService.findEqualUsername(userFollower.username)
      .then(response => {

        let whereFollower = response[0].followers.indexOf(this.user.id);

        if (whereFollower != -1) {
          response[0].followers.splice(whereFollower, 1);
        }
        this.dataService.updateFollows(response[0])
          .then(() => {
            this.dataService.findEqualUsername(this.user.username)
              .then(response => {
                let whereFollowing = response[0].following.indexOf(userFollower.id);
                if (whereFollowing != -1) {
                  response[0].following.splice(whereFollowing, 1);
                }

                this.dataService.updateFollows(response[0]);

                this.dataService.findEqualUsername(this.username)
                  .then(res => {
                    this.profileUser = res[0];

                  })
              })
          })
      })
  }


}
