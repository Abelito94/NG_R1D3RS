import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-otherprofile-user',
  templateUrl: './otherprofile-user.component.html',
  styleUrls: ['./otherprofile-user.component.css']
})
export class OtherprofileUserComponent implements OnInit {
  @Input() user;
  constructor() {}
  ngOnInit(): void {}
  /*@Output() 
  emitter = new EventEmitter<string>();


  fwing = false;
  localUser = JSON.parse(localStorage.getItem('user'));

 

  emitFollower(){
    this.emitter.emit(this.user);
  }*/
 
}
