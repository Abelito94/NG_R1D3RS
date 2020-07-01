import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  //USER DATA
  username: string = '';
  email: string = '';
  password: string = '';
  profileUrl = null;
  coverUrl: string = '';
  tags: string = '';
  newUser: object = {};
  callEmail: string = '';

  //EMAIL VALIDATION
  emailValidator = new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
  emailIsValid: boolean = false;
  emailFormatValidation: boolean = true;
  emailIsAvaible: boolean = true;

  //USER VALIDATION
  usernameIsValid: boolean = false;
  usernameFormatValidation: boolean = true;
  usernameIsAvaible: boolean = true;

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
  //CHARGE IMG
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.profileUrl = event.target.result;
      }
    }
  }

  setEmail() {
    this.email = this.callEmail || '';
    this.callEmail = '';
  }

  async checkEmails() {
    var email = await this.APIService.findEqualEmail(this.email)
    this.emailIsAvaible = email.length === 0;
  }
  isValidEmail() {
    if (this.email.length < 1 || this.email === '') {
      this.emailIsValid = false;
      this.emailFormatValidation = true;
    } else {
      this.emailIsValid = false;
      this.emailFormatValidation = this.emailValidator.test(this.email)
      if (this.emailFormatValidation) {
        this.checkEmails()
          .then(() => {
            if (this.emailFormatValidation && this.emailIsAvaible) {
              this.emailIsValid = true;
            }
            else {
              this.emailIsValid = false;
            }
          })
      }
    }
  }

  async checkUsernames() {
    var user = await this.APIService.findEqualUsername(this.username)
    this.usernameIsAvaible = user.length === 0;
  }

  isValidUsername() {
    if (this.username.length < 1 || this.username === '') {
      this.usernameIsValid = false;
      this.usernameFormatValidation = true;
    } else {
      this.usernameIsValid = false;
      if (this.username.length > 3) {
        this.usernameFormatValidation = true;
      } else {
        this.usernameFormatValidation = false;
      }
      if (this.usernameFormatValidation) {
        this.checkUsernames()
          .then(() => {
            if (this.usernameFormatValidation && this.usernameIsAvaible) {
              this.usernameIsValid = true;
            }
            else {
              this.usernameIsValid = false;
            }
          })
      }
    }
  }
}

//CONDICIONES


// Username:

// - Debe ser mayor de 5 caracte().            -----> Tiener que ser mayor de 5
// - No estar en la base de datos registrado    -----> Nombre de usuario no disponible

// Password:

// - Mayor de 8 caracte().                     -----> Debe ser mayor de 8 caracta().

