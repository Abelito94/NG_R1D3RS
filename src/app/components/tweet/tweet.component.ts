import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent {
  @Input() tweets: Array<any>
  @Input() me
  @Output() notifyErase = new EventEmitter();
  @Output() remitterLike = new EventEmitter();
  @Output() remitterNoLike = new EventEmitter();
  @Output() retweetearInTheHome = new EventEmitter();
  @Output() onretweetearInTheHome = new EventEmitter();

  ngOnInit() {
  }
  eraseFromParent(tweet){
    this.notifyErase.emit(tweet);
  }
  remitLike(tweet) {
    this.remitterLike.emit(tweet);
  }

  remitNoLike(tweet) {
    this.remitterNoLike.emit(tweet);
  }

  retweetearInTheTweet(tweet) {
    this.retweetearInTheHome.emit(tweet);
  }

  onretweetearInTheTweet(tweet) {
    this.onretweetearInTheHome.emit(tweet);
  }
}
