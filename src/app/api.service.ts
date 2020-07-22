import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  URL = 'http://localhost:3000/';
  constructor() { }

  async getAllTweets(page): Promise<any> {
    const res = await axios.get(`${this.URL}tweets?_sort=creationDate&_order=desc&_page=${page}`)
    return res.data
  }

  getAllUsers(): Promise<any> {
    return axios.get(`${this.URL}users`)
      .then(response => response.data)
      .catch(err => console.log(err))
  }

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
    const res = await axios.post(`${this.URL}tweets`, tweet)
    return res.data
  }
  createUser(newUser): Promise<any> {
    return axios.post(`${this.URL}users`, newUser)
      .then(response => console.log(response.data))
      .catch(err => console.log(err))
  }

  async gettweetsByUser(page, userID) {
    const res = await axios.get(`${this.URL}tweets?userID=${userID}&_sort=creationDate&_order=desc&_page=${page}`)
    return res.data
  }

  updateFollows(user) {
    return axios.put(`${this.URL}users/${user.id}`, user)
      .then(response => response.data)
  }

  getFollowingTweets(arrUserID, pageFollowing) {
    let promises = [];
    arrUserID.forEach(userID => {
      promises.push(axios.get(`${this.URL}tweets?userID=${userID}&_sort=creationDate&_order=desc&_page=${pageFollowing}`));
    })
    return Promise.all(promises)
      .then(responses => {
        return responses;
      })
  }
  eraseTweet(tweetId) {
    return axios.delete(`${this.URL}tweets/${tweetId}`)
      .then(response => response.data);
  }
  updateTweet(tweet) {
    return axios.put(`${this.URL}tweets/${tweet.id}`, tweet)
      .then(response => response.data)
  }
  updateUser(userID,newData){
    //console.log(newData);
    return axios.patch(`${this.URL}users/${userID}`, newData)
    .then(response => {
      //console.log(response.data)
      response.data

    })
  }
}
