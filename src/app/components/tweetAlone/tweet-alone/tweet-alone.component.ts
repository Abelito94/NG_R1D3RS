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
export class TweetAloneComponent {
  @Input() tweet;
  @Input() me;
  user;

  @Output() emitterLike = new EventEmitter();
  @Output() emitterNoLike = new EventEmitter();

  ownUser;

  //userID: string = this.tweet.userID
  @Output() notifyErase = new EventEmitter<number>();

  localUser = JSON.parse(localStorage.getItem('user'));

  constructor(private tweetService: APIService) {
    library.add(faCamera);
    const camera = icon({ prefix: 'fas', iconName: 'camera' });
  }

  async ngOnInit(){
    this.user = await this.tweetService.getUserById(this.tweet.userID);
    this.ownUser = JSON.parse(localStorage.getItem('user'));
  }

  eraseFromChild(){
    this.notifyErase.emit(this.tweet.id);
  }
  emitLike(){
    this.emitterLike.emit(this.tweet);
  }


  emitNoLike(){
    this.emitterNoLike.emit(this.tweet);
  }


}
