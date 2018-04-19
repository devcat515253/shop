import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthAdminLoginService {

  // baseUrl  = 'http://localhost:8000';
  baseUrl  = 'http://107.181.175.121:8000';

  constructor(private http: HttpClient) { }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUserAdmin');
  }


  login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/api/checkLoginAdmin`, { login: username, pas: password })
      .map(user => {

         // console.log(user);
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUserAdmin', JSON.stringify(user));
        }

        return user;
      });
  }

}
