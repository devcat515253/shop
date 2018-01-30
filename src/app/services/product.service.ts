import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../entity/product';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ProductService {
      // Products: Product[];
      baseUrl  = 'http://192.168.0.106:8000';
  constructor(private http: HttpClient) { }


  getProductItem(nameProduct: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getItemProd/${nameProduct}` );
  }

  getProdFromCategory(nameCategory: string) {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getFromCategory/${nameCategory}` );
  }

  getProdFromSubCategory(nameSubCategory: string) {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getFromSubCategory/${nameSubCategory}` );
  }

  getProdFromID(id_prod) {
    let prod_id  = +id_prod;
    return this.http.get<Product[]>(`${this.baseUrl}/api/getProdFromID/${prod_id}` );
  }
  getProdFromIdNoImg(id_prod) {
    let prod_id  = +id_prod;
    return this.http.get<Product[]>(`${this.baseUrl}/api/getProdFromIdNoImg/${prod_id}` );
  }

  getProdTypes() {
    return this.http.get<any>(`${this.baseUrl}/api/getProdTypes` );
  }

  getLastProds() {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getLastProds` );
  }

  getProdsByType(type_prod: string) {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getProdsByType/${type_prod}` );
  }


  getProdsForSearch() {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getProdsForSearch` );
  }

  getOptionsByType(id_type: number) {
    // console.log(id_type);
    return this.http.get<any>(`${this.baseUrl}/api/getOptionsByType/${id_type}` );
  }

  getOptionsByIdProd(id_prod: number) {
    // console.log(id_type);
    return this.http.get<any>(`${this.baseUrl}/api/getOptionsByIdProd/${id_prod}` );
  }


  addNewProd(data) {
     // console.log(data.getAll('photo'));
     // console.log(data.getAll('data'));
    return this.http.post<any>(`${this.baseUrl}/api/addNewProd`, data );
  }

  updateProd(data) {
    // console.log(data.getAll('photo'));
    // console.log(data.getAll('data'));
    return this.http.post<any>(`${this.baseUrl}/api/updateProd`, data );
  }

  deleteProd(prod) {
    return this.http.post<any>(`${this.baseUrl}/api/deleteProd`, prod );
  }

  getAllProducts() {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getAllProduct` );
  }

  getByVendor(vendor) {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getByVendor/${vendor}` );
  }

  getRandomProds() {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getRandomProds` );
  }

}


