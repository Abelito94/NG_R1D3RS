import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent {
  @Input() tweets: Array<any>
  @Input() me

  @Output() remitterLike = new EventEmitter();
  @Output() remitterNoLike = new EventEmitter();
  ngOnInit() {
  }

  remitLike(tweet){
    this.remitterLike.emit(tweet);
  }

  remitNoLike(tweet){
    this.remitterNoLike.emit(tweet);
  }

  @Output() notifyErase = new EventEmitter();
  ngOnInit() {
  }
  eraseFromParent(tweet){
    this.notifyErase.emit(tweet);
  }


}
