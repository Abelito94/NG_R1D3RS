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
  ngOnInit() {
  }
  eraseFromParent(tweet){
    this.notifyErase.emit(tweet);
  }

}
