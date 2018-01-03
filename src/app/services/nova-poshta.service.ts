import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Product} from '../entity/product';

@Injectable()
export class NovaPoshtaService {

  baseUrl  = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getCities(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getCities` );
  }

  getOffices(city): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getOffices/${city}` );
  }
}
