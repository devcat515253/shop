import { Injectable } from '@angular/core';
import {Order} from '../entity/order';
import {HttpClient} from '@angular/common/http';
import {FullCartItem} from '../entity/full-cart-item';

@Injectable()
export class OrderService {

  baseUrl  = 'http://localhost:8000';

  constructor(private http: HttpClient) { }


  addOrder(order: Order) {
    // const body = {name: user.name, age: user.age};
    // console.log(order);
    return this.http.post(`${this.baseUrl}/api/addOrder`, order);

  }

  updateOrder(order: any) {
    // const body = {name: user.name, age: user.age};
    // console.log(order);
    return this.http.post(`${this.baseUrl}/api/updateOrder`, order);

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

  getResSearchByPhone(searchInput) {
  // console.log(searchInput);
  const body = { search: searchInput};
  return this.http.post(`${this.baseUrl}/api/getResSearchByPhone`, body);
  }


  getOrder(order_id) {
    return this.http.get<any>(`${this.baseUrl}/api/getOrder/${order_id}` );
  }

  getOrderProds(order_id) {
    return this.http.get<any>(`${this.baseUrl}/api/getOrderProds/${order_id}` );
  }

  cartToServ(cart: FullCartItem[]) {
    let cartRes = [];

    for (let item of cart) {
      let newItem = {
        product: {
          product_id: item.product.product_id,
          product_price: item.product.product_price,
          product_promo_price: item.product.product_promo_price
        },
        count: item.count
      };
      cartRes.push(newItem);
    }

    return cartRes;
  }

  cartToServUpdateProds(cart: any) {
    let cartRes = [];

    for (let item of cart) {

      let newItem = {
        product: {
          product_id: item.product_id,
          product_price: item.order_prod_price,
          product_promo_price: item.order_prod_promo_price || null
        },
        count: item.order_prod_count
      };
      cartRes.push(newItem);
    }

    return cartRes;
  }

}
