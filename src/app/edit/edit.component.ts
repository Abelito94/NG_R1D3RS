import { Component, OnInit, NgZone } from '@angular/core';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { APIService } from '../api.service';
import { Router } from '@angular/router';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  localUser = JSON.parse(localStorage.getItem('user'));
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
  tags: string[] = this.localUser.tags;
  profilePictureURL;
  newUser: object = {};
  tag: string = '';

  tagsMaxcount = false;

  profilePosition = null;
  coverPosition = null;
  
  constructor(private APIService: APIService,
    private router: Router,
    private cloudinary: Cloudinary,
    private zone: NgZone) { 
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
          //console.log(fileItem);
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
  //FIN OnInit...

  chargeImg(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.localUser.profilePictureURL = event.target.result;
        if(this.coverPosition == null){
          this.profilePosition = 0;
        }
        else{
          this.profilePosition = 1;
        }
      }
    }
  }

  chargeCover(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.localUser.profileCoverURL = event.target.result;
        if(this.profilePosition == null){
          this.coverPosition = 0;
        }
        else{
          this.coverPosition = 1;
        }
      }
    }
  }

  /*setProfilePicture() {
    if (!this.profilePictureURL) {
      this.profilePictureURL = "https://katakrak.net/sites/default/files/default_images/default_profile_0.jpg"
    }
    this.step = 3
  }*/

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

  updateUser(){
  
    if(this.coverPosition != null && this.profilePosition != null){
      this.localUser.profilePictureURL = this.responses[this.profilePosition].data.url;
      this.localUser.profileCoverURL = this.responses[this.coverPosition].data.url;
      console.log('los dos');
    }
    else{
      if(this.coverPosition == null && this.profilePosition != null){
        this.localUser.profilePictureURL = this.responses[this.profilePosition].data.url;
        console.log('perfil');
      }
      if(this.coverPosition != null && this.profilePosition == null){
        this.localUser.profileCoverURL = this.responses[this.coverPosition].data.url;
        console.log('cover');
      }
    } 
    
    this.APIService.updateUser(this.localUser.id, {
      profilePictureURL:this.localUser.profilePictureURL,
      profileCoverURL:this.localUser.profileCoverURL,
      tags: this.tags
    })
    .then( () => {
      this.responses = [];
      this.coverPosition = null;
      this.profilePosition = null;
      //alert('Ha actualizado tu perfil con exito...');
      this.router.navigate(['home']);
      
    })
  }


}
