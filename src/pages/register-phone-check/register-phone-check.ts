import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RegisterPhoneCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-phone-check',
  templateUrl: 'register-phone-check.html',
})
export class RegisterPhoneCheckPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPhoneCheckPage');
  }

  next() {
    var confirm = true;
    var registered = false;
    var user = {cellphone:"", fullName:"", shortName:"", email:""}
    if(confirm && registered) {
      user.cellphone = "+55(44)99119-6405";
      user.fullName = "Savio de Oliveira Camacam";
      user.shortName = "saviocamacam";
      user.email = "saviocamacam@gmail.com";

      this.navCtrl.push('UserBasicInfoPage', {step: 'user', user: user} , {
        animate: true,
        direction: 'forward'
      });

    } else if(confirm) {
      this.navCtrl.push('UserBasicInfoPage', {step: 'user'}, {
        animate: true,
        direction: 'forward'
      });
    }
  }

}
