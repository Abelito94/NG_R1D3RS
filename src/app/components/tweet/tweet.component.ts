import { Component, Input } from '@angular/core';
import { APIService } from '../../api.service'

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent {
  @Input() tweets
}
