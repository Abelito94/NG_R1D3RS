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
  user;
  expanded = false;
  ownUser;

  constructor(private tweetService: APIService) { }

  async ngOnInit() {
    this.user = await this.tweetService.getUserById(this.tweet.userID);
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
}
