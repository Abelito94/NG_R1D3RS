import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { Router } from '@angular/router';
import axios from 'axios';

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
  errorLogin:boolean= true;
  errorMessage:string= '';
  
  
  loginUser(){
    
    let user = {
      email: this.userLogin,
      password: this.userPass
    }
    
    axios.get(`http://localhost:3000/users?username=${user.email}`)
    .then(response => {
      if(response.data.length == 1){
        this.errorLogin = false;
        localStorage.setItem('user', JSON.stringify(response.data[0]));
        this.router.navigate(['']);
      }
      else{
        this.errorMessage = 'The email or password do not match. Please review it and try again.';
        return this.errorMessage;
      }
    })
    .catch(error => {console.log(error)})
  }

}
