import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-otherprofile-user',
  templateUrl: './otherprofile-user.component.html',
  styleUrls: ['./otherprofile-user.component.css']
})
export class OtherprofileUserComponent implements OnInit {
  @Input() user;
  @Output() emitterFollows = new EventEmitter<string>();
  @Output() emitterNotFollows = new EventEmitter<string>();
 
  constructor() {}
  ngOnInit(): void {}

  localUser = JSON.parse(localStorage.getItem('user'));

  emitFollow(){
    this.emitterFollows.emit(this.user);
    //this.emitterFollowing.emit(this.localUser);
  }

  emitNotFollow(){
    this.emitterNotFollows.emit(this.user);
    //this.emitterNotFollowing.emit(this.localUser);
  }
 
}
