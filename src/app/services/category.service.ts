import { Injectable } from '@angular/core';
import {Product} from '../entity/product';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CategoryService {

  // baseUrl  = 'http://localhost:8000';
 baseUrl  = 'http://107.181.175.121:8000';

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

  getCatWithSubCat() {
    return this.http.get<any>(`${this.baseUrl}/api/getCatWithSubCat` );
  }

  updateCat(category) {
    return this.http.post<any>(`${this.baseUrl}/api/updateCat`, category );
  }

  checkCat(category) {
    return this.http.post<any>(`${this.baseUrl}/api/checkCat`, category );
  }

  deleteCat(category) {
    return this.http.post<any>(`${this.baseUrl}/api/deleteCat`, category );
  }

  addCat(category) {
    return this.http.post<any>(`${this.baseUrl}/api/addCat`, category );
  }


  updateSubCat(subcategory) {
    return this.http.post<any>(`${this.baseUrl}/api/updateSubCat`, subcategory );
  }

  checkSubCat(subcategory) {
    return this.http.post<any>(`${this.baseUrl}/api/checkSubCat`, subcategory );
  }

  deleteSubCat(subcategory) {
    return this.http.post<any>(`${this.baseUrl}/api/deleteSubCat`, subcategory );
  }

  addSubCat(subcategory) {
    return this.http.post<any>(`${this.baseUrl}/api/addSubCat`, subcategory );
  }

}
