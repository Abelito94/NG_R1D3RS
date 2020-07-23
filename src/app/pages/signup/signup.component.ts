import { Component, OnInit, Input, NgZone } from '@angular/core';
import { APIService } from '../../api.service'
import { Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // IMG LOADER
  public hasBaseDropZoneOver: boolean = false;
  public uploader: FileUploader;
  public title: string
  responses: Array<any>;

  // Stepper
  step = 1;


  //USER DATA
  username: string = '';
  email: string = '';
  password: string = '';
  tags: string[] = [];
  profilePictureURL;
  newUser: object = {};
  tag: string = '';

  tagsMaxcount = false;

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

  constructor(
    private APIService: APIService,
    private router: Router,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient) {

    this.responses = [];
    this.title = '';
  }

  ngOnInit(): void {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'myphotoalbum';

      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `myphotoalbum,${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append('folder', 'Profile');
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };
    const upsertResponse = fileItem => {

      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
        } else {
          // Create new response
          this.responses.push(fileItem);
        }
      });
    };
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );
    }

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );
    }

  }

  validateForm() {
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
        email: this.email,
        password: this.password,
      };
      this.step = 2
    }
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
    if (this.tag != '') {
      if (this.tags.length < 4) {
        this.tagsMaxcount = false
        this.tags.push(this.tag);
        this.tag = ''
      } else {
        this.tagsMaxcount = true
      }
    }
  }
  deleteTag(tagDeleted) {
    this.tagsMaxcount = false
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

      if (this.profilePictureURL != "https://katakrak.net/sites/default/files/default_images/default_profile_0.jpg") {
        this.profilePictureURL = this.responses[0].data.url
      }

      this.newUser = {
        username: this.username,
        name: this.username,
        email: this.email,
        password: this.password,
        tags: this.tags,
        profilePictureURL: this.profilePictureURL,
        gender: '',
        profileCoverURL: "https://static.vecteezy.com/system/resources/previews/000/547/809/non_2x/vector-abstract-lighting-effect-gradient-turquoise-pastel-green-mint-color-background.jpg",
        following: [],
        followers: [],
      };
      this.APIService.createUser(this.newUser)
        .then(() => {
          localStorage.setItem('user', JSON.stringify(this.newUser));
          this.router.navigate(['home']);
        })
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

