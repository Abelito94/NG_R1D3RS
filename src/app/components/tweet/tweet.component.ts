import { Component, Input, Output } from '@angular/core';
@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent {
  @Input() tweets: Array<any>
  @Input() me
  ngOnInit() {
  }
}
