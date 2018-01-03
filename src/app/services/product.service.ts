import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../entity/product';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ProductService {
      // Products: Product[];
      baseUrl  = 'http://localhost:8000';
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
}


