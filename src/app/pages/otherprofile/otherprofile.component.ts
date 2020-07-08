import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/api.service';


@Component({
  selector: 'app-otherprofile',
  templateUrl: './otherprofile.component.html',
  styleUrls: ['./otherprofile.component.css'],
})
export class OtherprofileComponent implements OnInit {

  
  otherTweets: any[];
  username;
  user;
  following = [];

  constructor(
    private route: ActivatedRoute, 
    private router : Router, 
    private dataService: APIService
    ) { }

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
  toHome(){
    this.router.navigateByUrl('/home');
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['sign']); 
  }
  
  async addFollows(userFollower) {
    let localUser = JSON.parse(localStorage.getItem('user'));

    await this.dataService.findEqualUsername(userFollower.username)
      .then( response => {
        
        let hastFollower = response[0].followers.some(fwer => fwer == localUser.id);
        
        if(hastFollower == false)
        {
          response[0].followers.push(localUser.id);
        }
        //Update api of user...
        this.dataService.updateFollows(response[0])
        .then(()=>{
          this.dataService.findEqualUsername(localUser.username)
          .then(response => {
            let hastFollowing = response[0].following.some(fwing => fwing == userFollower.id);
            if(hastFollowing == false)
            {
              response[0].following.push(userFollower.id);
            }
            //Update api of local user...
            this.dataService.updateFollows(response[0]);
            //reload page...
            this.dataService.findEqualUsername(this.username)
            .then(res => {
              this.user = res[0];
            })
            
          })
        })
      })
    }

    async deleteFollows(userFollower){
      let localUser = JSON.parse(localStorage.getItem('user'));

      await this.dataService.findEqualUsername(userFollower.username)
      .then(response =>{

        let whereFollower = response[0].followers.indexOf(localUser.id);

        if(whereFollower != -1){
          response[0].followers.splice(whereFollower, 1);
        }
        this.dataService.updateFollows(response[0])
        .then(()=>{
          this.dataService.findEqualUsername(localUser.username)
          .then(response =>{
            let whereFollowing = response[0].following.indexOf(userFollower.id);
            if(whereFollowing != -1){
              response[0].following.splice(whereFollowing, 1);
            }
  
            this.dataService.updateFollows(response[0]);
  
            this.dataService.findEqualUsername(this.username)
            .then(res => {
              this.user = res[0];
              
            })
          })
        })
      })
    }

  
}
