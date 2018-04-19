import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../entity/product';

@Injectable()
export class ProductTypesService {

  // baseUrl  = 'http://localhost:8000';
  baseUrl  = 'http://192.168.0.140:8000';

  constructor(private http: HttpClient) { }


  getProdTypes() {
    return this.http.get<any>(`${this.baseUrl}/api/getProdTypes` );
  }

  addProdType(newTypeProd) {
    const body = {
      newTypeProd: newTypeProd
    };
    return this.http.post<any>(`${this.baseUrl}/api/addProdType` , body);
  }


  getOptionsByType(id_type: number) {
    // console.log(id_type);
    return this.http.get<any>(`${this.baseUrl}/api/getOptionsByType/${id_type}` );
  }

  addProperty(newProperty, prod_type_id) {
    const body = {
      newProperty: newProperty,
      prod_type_id: prod_type_id
    };
    return this.http.post<any>(`${this.baseUrl}/api/addProperty`, body );
  }

  updateProperty(nameProperty, id_option) {
    const body = {
      nameProperty: nameProperty,
      id_option: id_option
    };
    return this.http.post<any>(`${this.baseUrl}/api/updateProperty`, body );
  }

  deleteProperty( id_option) {
    const body = {
      id_option: id_option
    };
    return this.http.post<any>(`${this.baseUrl}/api/deleteProperty`, body );
  }


  updateType(productType) {
    const body = {
      productType: productType
    };
    return this.http.post<any>(`${this.baseUrl}/api/updateType`, body );
  }


  checkProdsFromType(productType) {
    const body = {
      productType: productType
    };
    return this.http.post<any>(`${this.baseUrl}/api/checkProdsFromType`, body );
  }

  deleteType(productType) {
    const body = {
      productType: productType
    };
    return this.http.post<any>(`${this.baseUrl}/api/deleteType`, body );
  }


}
