import { Injectable } from '@angular/core';
import {Product} from '../entity/product';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CategoryService {

  baseUrl  = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<any>(`${this.baseUrl}/api/getCategories` );
  }

  getsubCategoriById(category_id) {
    return this.http.get<any>(`${this.baseUrl}/api/getsubCategoriById/${category_id}` );
  }

  getCatByIdSubCat(sub_category_id) {
    return this.http.get<any>(`${this.baseUrl}/api/getCatByIdSubCat/${sub_category_id}` );
  }
}
