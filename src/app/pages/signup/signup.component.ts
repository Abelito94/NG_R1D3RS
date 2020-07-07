import { Component, OnInit, Input } from '@angular/core';
import { APIService } from '../../api.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // Stepper
  step = 1;

  //USER DATA
  username: string = '';
  email: string = '';
  password: string = '';
  profilePictureURL;
  tags: string[] = [];
  newUser: object = {};
  tag: string = '';

  //EMAIL VALIDATION
  emailValidator = new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
  emailIsValid: boolean = false;
  emailFormatValidation: boolean = true;
  emailIsAvaible: boolean = true;
  emailIsEmpty: boolean = null;


  //USER VALIDATION
  usernameIsValid: boolean = false;
  usernameFormatValidation: boolean = true;
  usernameIsAvaible: boolean = true;
  usernameIsEmpty: boolean = null;


  //PASSWORD VALIDATION
  passwordIsValid: boolean = false;
  passwordFormatValidation: boolean = true;
  passwordIsEmpty: boolean = null;

  constructor(private APIService: APIService, private router: Router) {
  }
  ngOnInit(): void {
  }

  validateForm() {
    // if (this.email === '') {
    //   this.emailIsEmpty = true;
    // }
    // if (this.username === '') {
    //   this.usernameIsEmpty = true;
    // }
    // if (this.password === '') {
    //   this.passwordIsEmpty = true;
    // }
    // if (this.emailIsValid && this.usernameIsValid && this.passwordIsValid) {
    //   this.newUser = {
    //     username: this.username,
    //     email: this.email,
    //     password: this.password,
    //   };
    // }
    this.step = 2
  }

  chargeImg(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.profilePictureURL = event.target.result;
      }
    }
  }

  setProfilePicture() {
    if (!this.profilePictureURL) {
      this.profilePictureURL = "https://katakrak.net/sites/default/files/default_images/default_profile_0.jpg"
    }
    this.step = 3
  }

  addTag() {
    this.tags.push(this.tag);
    this.tag = ''
  }
  deleteTag(tagDeleted) {
    this.tags = this.tags.filter(tag => tag != tagDeleted)

  }
  createUser() {
    if (this.email === '') {
      this.emailIsEmpty = true;
    }
    if (this.username === '') {
      this.usernameIsEmpty = true;
    }
    if (this.password === '') {
      this.passwordIsEmpty = true;
    }
    if (this.emailIsValid && this.usernameIsValid && this.passwordIsValid) {
      this.newUser = {
        username: this.username,
        name: this.username,
        email: this.email,
        password: this.password,
        tags: this.tags,
        profilePictureURL: this.profilePictureURL,
        gender: '',
        profileCoverURL: "http://images.firstcovers.com/covers/g/green_abstract-3733.jpg?i",
        following: [],
        followers: [],
      };
      this.APIService.createUser(this.newUser);
      localStorage.setItem('user', JSON.stringify(this.newUser));
      this.router.navigate(['home']);
    } else {
      this.step = 1;
    }
  }

  back() {
    this.step--
  }

  async checkEmails() {
    var email = await this.APIService.findEqualEmail(this.email)
    this.emailIsAvaible = email.length === 0;
  }
  isValidEmail() {
    this.emailIsEmpty = false;
    if (this.email.length < 1) {
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
    this.usernameIsEmpty = false;
    if (this.username.length < 1) {
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

  isValidPassword() {
    this.passwordIsEmpty = false;
    if (this.password.length < 1) {
      this.passwordIsValid = false;
      this.passwordFormatValidation = true;
    } else if (this.password.length < 8) {
      this.passwordIsValid = false;
      this.passwordFormatValidation = false;
    } else {
      this.passwordIsValid = true;
      this.passwordFormatValidation = true;
    }
  }

  close() {
    this.router.navigate(['sign']);
  }
}

