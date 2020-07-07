import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-otherprofile-user',
  templateUrl: './otherprofile-user.component.html',
  styleUrls: ['./otherprofile-user.component.css']
})
export class OtherprofileUserComponent implements OnInit {
  @Input() user;
  @Output() emitterFollower = new EventEmitter<string>();
  @Output() emitterNotFollower = new EventEmitter<string>();

  constructor() {}
  ngOnInit(): void {}

  localUser = JSON.parse(localStorage.getItem('user'));

  emitFollower(){
    this.emitterFollower.emit(this.user);
  }

  emitNotFollower(){
    this.emitterNotFollower.emit(this.user);
  }

  
 
}
