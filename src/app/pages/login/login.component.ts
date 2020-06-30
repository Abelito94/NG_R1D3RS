import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { Router } from '@angular/router';

type User = {
  username:string,
  email:string,
  password:string
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  constructor(private loginservice : APIService, private router : Router) {}

  ngOnInit(): void {}


  userLogin:string='';
  userPass:string='';

  async loginUser(){
    const users = await this.loginservice.getAllUsers();
    
    const user:User = {
      username: this.userLogin,
      email: this.userLogin,
      password: this.userPass
    }

   let userLog = users.some(us => us.username == user.username || us.email == user.email);
   if(userLog){
     this.router.navigate(['']);
   }
   else{
     console.log('mal');
   }
   
  }

}
