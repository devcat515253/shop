import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AuthAdminLoginService} from '../services/auth-admin-login.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as crypto from 'crypto-js';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminLoginComponent implements OnInit {

  returnUrl: string;
  loading = false;

  model = {
    login: '',
    pas: '',
  };

  constructor( private  adminLoginService: AuthAdminLoginService,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit() {

    // reset login status
    this.adminLoginService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


  }

  login() {
     this.loading = true;

  // encript login and password
    let encryptedAESlog = CryptoJS.AES.encrypt(this.model.login, 'MyLogin_');
    let encryptedAESpas = CryptoJS.AES.encrypt(this.model.pas, 'MyPassword_');

    // console.log(encryptedAES.toString());

    // var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES,  'MyPassword_');
    // var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
    // console.log(plaintext);


    this.adminLoginService.login(encryptedAESlog.toString(), encryptedAESpas.toString())
      .subscribe(
        data => {

           // проверка на пустоту объекта  объект == {}
          if ( Object.keys( data ).length === 0) {
            // this.loading = false;
            alert('Пользователь не найден');
            return;
          }
          this.router.navigate([this.returnUrl]);
        },
        error => {
         // this.alertService.error(error);
          alert('Произошла ошибка');
          // this.loading = false;
        });
  }

}
