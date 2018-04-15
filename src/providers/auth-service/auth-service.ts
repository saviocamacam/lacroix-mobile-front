import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  apiUrl = 'api'

  constructor(
    public http: HttpClient,
    public platform: Platform
  ) {
    if(platform.is('cordova')) {
      this.apiUrl = 'http://localhost:3000/api'
    }
    console.log('Hello AuthServiceProvider Provider');
  }

  addUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/user', JSON.stringify(data))
        .subscribe(res => {
          console.log(res);
          resolve(res);
        }, (err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  getUsers() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/user').subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  sendSms(data) {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/user/cellphonecheck', data).subscribe(res => {
        console.log(res);
        resolve(res);
      },(err) => {
        console.log(err);
        reject(err);
      })
    })
  }

}
