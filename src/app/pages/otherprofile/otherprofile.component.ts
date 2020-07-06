import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/api.service';

@Component({
  selector: 'app-otherprofile',
  templateUrl: './otherprofile.component.html',
  styleUrls: ['./otherprofile.component.css']
})
export class OtherprofileComponent implements OnInit {


  otherTweets: any[];
  username;
  user;
  following = [];

  constructor(private route: ActivatedRoute, private router : Router, private dataService: APIService) { 
    //this.loadProfileByUserName();
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    
    this.dataService.findEqualUsername(this.username)
    .then(res => {
      this.user = res[0];

      this.dataService.gettweetsByUser(this.user.id)
      .then(response => {
        this.otherTweets = response;
      })
    })

  }
  
  logout(){
    localStorage.clear();
    this.router.navigate(['sign']); 
  }

  async addFollower(userFollower) {
    let localUser = JSON.parse(localStorage.getItem('user'));
    /*this.following.push(userFollower.id);
    localUser.following = this.following;
    localStorage.setItem('user', JSON.stringify(localUser));*/

    await this.dataService.findEqualUsername(userFollower.username)
      .then(response => {
        console.log(response[0].username);
        response[0].following.some(fwing => fwing == localUser.id);
        response[0].following.push(localUser.id);
        //response[0].following.unique();
        this.dataService.createFollower(response[0]);
       
      })
  }
}
