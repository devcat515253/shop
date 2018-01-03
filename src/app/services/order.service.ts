import { Injectable } from '@angular/core';
import {Order} from '../entity/order';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OrderService {

  baseUrl  = 'http://localhost:8000';

  constructor(private http: HttpClient) { }


  addOrder(order: Order) {
    // const body = {name: user.name, age: user.age};
    // console.log(order);
    return this.http.post(`${this.baseUrl}/api/addOrder`, order);

  }

  getAllOrder() {
    return this.http.get(`${this.baseUrl}/api/getAllOrder`);
  }

  getNewOrder() {
    return this.http.get(`${this.baseUrl}/api/getNewOrder`);
  }

  getProcessingOrder() {
    return this.http.get(`${this.baseUrl}/api/getProcessingOrder`);
  }

  getDoneOrder() {
    return this.http.get(`${this.baseUrl}/api/getDoneOrder`);
  }

  getRejectedOrder() {
    return this.http.get(`${this.baseUrl}/api/getRejectedOrder`);
  }

  getResSearch(searchInput) {
    // console.log(searchInput);
    const body = { search: searchInput};
    return this.http.post(`${this.baseUrl}/api/getResSearch`, body);
  }
}
