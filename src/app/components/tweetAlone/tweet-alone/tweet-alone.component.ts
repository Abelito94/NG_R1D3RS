import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { APIService } from '../../../api.service';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { ThrowStmt } from '@angular/compiler';



@Component({
  selector: 'app-tweet-alone',
  templateUrl: './tweet-alone.component.html',
  styleUrls: ['./tweet-alone.component.css']
})
export class TweetAloneComponent implements OnInit{
  @Input() tweet;
  @Input() me;
  user;
  @Output() emitterLike = new EventEmitter();
  @Output() emitterNoLike = new EventEmitter();
  //userID: string = this.tweet.userID
  // @Output() notifyErase = new EventErase();

  localUser = JSON.parse(localStorage.getItem('user'));

  constructor(private tweetService: APIService) {
    library.add(faCamera);
    const camera = icon({ prefix: 'fas', iconName: 'camera' });
  }

  async ngOnInit(){
    this.user = await this.tweetService.getUserById(this.tweet.userID);
  }

  erase(){
    // this.notifyErase();
  }
  emitLike(){
    this.emitterLike.emit(this.tweet);
  }

  emitNoLike(){
    this.emitterNoLike.emit(this.tweet);
  }
}
