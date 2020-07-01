import { Injectable } from '@angular/core';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class APIService {
  URL = 'http://localhost:3000/';
  constructor() { }
  getAllTweets(): Promise<any> {
    return axios.get(`${this.URL}tweets`)
      .then(response => response.data)
      .catch(err => console.log(err))
  }
  getAllUsers(): Promise<any> {
    return axios.get(`${this.URL}users`)
      .then(response => response.data)
      .catch(err => console.log(err))
  }
  findEqualUsername(username): Promise<any> {
    return axios.get(`${this.URL}users?username=${username}`)
      .then(response => response.data)
      .catch(err => console.log(err))
  }
  findEqualEmail(email): Promise<any> {
    return axios.get(`${this.URL}users?email=${email}`)
      .then(response => response.data)
      .catch(err => console.log(err))
  }
}
