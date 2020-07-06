import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  URL = 'http://localhost:3000/';
  constructor() { }

  async getAllTweets(): Promise<any> {
    const res = await axios.get(`${this.URL}tweets?_sort=creationDate&_order=desc&_page=1&_limit=50`)
    return res.data
  }

  getAllUsers(): Promise<any> {
    return axios.get(`${this.URL}users`)
      .then(response => response.data)
      .catch(err => console.log(err))
  }
  // getUserId(username): Promise<any> {
  //   return axios.get(`${this.URL}users?username=${username}`)
  //     .then(response => response.data)
  //     .catch(err => console.log(err))
  // }
  getUserById(userId): Promise<any> {
    return axios.get(`${this.URL}users/${userId}`)
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
  async createTweet(tweet) {
    const res = await axios.post(`${this.URL}tweets`,tweet)
    return res.data
  }
  createUser(newUser): Promise<any> {
    return axios.post(`${this.URL}users`, newUser)
      .then(response => console.log(response.data))
      .catch(err => console.log(err))
  }

  async gettweetsByUser(userID){
    const res = await axios.get(`${this.URL}tweets?userID=${userID}&_sort=creationDate&_order=desc&_page=1&_limit=50`)
    return res.data
  }

  createFollower(user){
    return axios.put(`${this.URL}users/${user.id}`, user)
      .then(response => response.data)
  }
}
