import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { APIService } from '../../api.service'
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';

type Tweet = {
  userID: any;
  text: string;
  creationDate: string;
  numLikes: number;
  numRTs: number;
  urlTweet: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public title: string
  public hasBaseDropZoneOver: boolean = false;
  public uploader: FileUploader;

  tweets: any[] = []
  myTweets: any[]
  followingtweets: any[] = [];
  user
  text: string = '';
  urlImages: string;
  responses: Array<any>;

  constructor(private tweetService: APIService,
    private router: Router,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient
  ) {}

  createTweet(text) {

    var newtweet: Tweet = {
      userID: this.user.id,
      text: text,
      creationDate: moment().format(),
      numLikes: 0,
      numRTs: 0,
      urlTweet: this.responses[0].data.url || ""
    }

    this.tweetService.createTweet(newtweet)
      .then(res => console.log(res))
      .then(() => {
        this.tweetService.getAllTweets()
          .then(res => this.tweets = res)
          .then(res => this.myTweets = res.filter(tweet => tweet.userID === this.user.id))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    this.text = '';
    this.responses = [];
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['sign']);
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
      form.append('folder', 'Assets');
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
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );



      //Load home...
      this.responses = [];
      this.title = '';

      this.user = JSON.parse(localStorage.getItem('user'))
      this.tweetService.findEqualUsername(this.user.username)
      .then(fullUser => {
        this.user = fullUser[0]
        localStorage.clear()
        localStorage.setItem('user', JSON.stringify(fullUser[0]))
      })
      .then(()=>{
        this.tweetService.getAllTweets()
          .then(res => {
            res.forEach(element => {
              element.creationDate = `${moment(element.creationDate).format('ll')} - ${moment().format('LT')}`;
            })
            return res
          })
      .then(res =>{
        //all tweets
        this.tweets = res;
        //my tweets
        this.myTweets = res.filter(tweet => tweet.userID === this.user.id);
        //my following tweets
        this.tweetService.getFollowingTweets(this.user.following)
        .then(matrizTweets =>{
          matrizTweets.map(arrayTweets =>{
            arrayTweets.data.forEach(tweets => this.followingtweets.push(tweets));
          })
          this.followingtweets.sort(function(a, b){
            var dateA = new Date(a.creationDate).getTime();
            var dateB = new Date(b.creationDate).getTime();
            return dateA < dateB ? 1 : -1;
          })
        })
      })
      .catch(err => console.log(err))
    })
  }

  updateTitle(value: string) {
    this.title = value;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }

  deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };
}

