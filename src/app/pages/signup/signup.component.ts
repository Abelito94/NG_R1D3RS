import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  username: string = '';
  email: string = '';
  password: string = '';
  profileUrl = null;
  coverUrl: string = '';
  tags: string = '';
  newUser: object = {};
  isAvaible: boolean = true;
  callEmail: string = '';

  constructor(private APIService: APIService) { }
  ngOnInit(): void {
  }

  createUser() {
    this.newUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      profileUrl: this.profileUrl,
      coverUrl: this.coverUrl,
      tags: this.tags
    }
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.profileUrl = event.target.result;
      }
    }
  }

  async checkUsernames() {
    var user = await this.APIService.findEqualUsername(this.username)
    this.isAvaible = user.length === 0;
    console.log(this.isAvaible);
  }
  setEmail() {
    this.email = this.callEmail || '';
    this.callEmail = '';
  }
}
