import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { APIService } from '../../../api.service';

@Component({
  selector: 'app-tweet-alone',
  templateUrl: './tweet-alone.component.html',
  styleUrls: ['./tweet-alone.component.css']
})
export class TweetAloneComponent implements OnInit {
  @Input() tweet;
  @Input() me;
  @Output() notifyErase = new EventEmitter<number>();
  @Output() emitterLike = new EventEmitter();
  @Output() emitterNoLike = new EventEmitter();
  @Output() retweetear = new EventEmitter();
  @Output() onretweetear = new EventEmitter();

  user;
  expanded = false;
  ownUser;
  userRT
  constructor(private tweetService: APIService) { }

  async ngOnInit() {

    if (this.tweet.isRt) {
      this.userRT = await this.tweetService.getUserById(this.tweet.userID)
      this.user = await this.tweetService.getUserById(this.tweet.tweet.userID)
    } else {
      this.user = await this.tweetService.getUserById(this.tweet.userID)
    }
    this.ownUser = JSON.parse(localStorage.getItem('user'));
  }

  eraseFromChild() {
    this.notifyErase.emit(this.tweet.id);
  }
  expandImage() {
    if (this.expanded) {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
  }
  emitLike() {
    console.log('like');
    this.emitterLike.emit(this.tweet);
  }


  emitNoLike() {
    console.log('dislike');

    this.emitterNoLike.emit(this.tweet);
  }

  retweet() {
    if (this.tweet.isRt) {
      this.tweet.tweet.numRTs.push(this.ownUser.id)
    } else {
      this.tweet.numRTs.push(this.ownUser.id)
    }
    this.retweetear.emit(this.tweet);
  }

  onretweet() {
    if (this.tweet.isRt) {
      this.tweet.tweet.numRTs = this.tweet.tweet.numRTs.filter(res => res != this.ownUser.id)
    } else {
      this.tweet.numRTs = this.tweet.numRTs.filter(res => res != this.ownUser.id)
    }
    this.onretweetear.emit(this.tweet);
  }

}
