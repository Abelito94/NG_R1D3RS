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

    await this.dataService.findEqualUsername(userFollower.username)
      .then(response => {
        
        let hastFollowing = response[0].followers.some(fwing => fwing == localUser.id);
        
        if(hastFollowing == false)
        {
          response[0].followers.push(localUser.id);
        }
        
        this.dataService.updateFollower(response[0])
          .then(() =>{
            this.dataService.findEqualUsername(this.username)
              .then(res => {
                this.user = res[0];
              })
          });
       
      })
  }


  async deleteFollower(userFollower) {
    let localUser = JSON.parse(localStorage.getItem('user'));

    await this.dataService.findEqualUsername(userFollower.username)
      .then(response => {
        
        let whereFollower = response[0].followers.indexOf(localUser.id);
        
        if(whereFollower != -1){
          response[0].followers.splice(whereFollower, 1);
        }
        
        this.dataService.updateFollower(response[0])
          .then(() =>{
            this.dataService.findEqualUsername(this.username)
              .then(res => {
                this.user = res[0];
              })
          });
       
      })
  }
}
