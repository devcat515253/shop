import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ProductTypesService} from '../services/product-types.service';
import {of} from 'rxjs/observable/of';

@Component({
  selector: 'app-admin-type-prod',
  templateUrl: './admin-type-prod.component.html',
  styleUrls: ['./admin-type-prod.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminTypeProdComponent implements OnInit {

  productTypes: any;

  newTypeProd: string;

  constructor(private prodTypesService: ProductTypesService) { }

  ngOnInit() {
    this.getProdTypes();
  }

  getProdTypes() {
    this.prodTypesService.getProdTypes()
      .subscribe(
        (resp) => {
          this.productTypes = resp;

        },
        (err) => {
          console.log('Не удалось получить типы продукта');
          console.log(err);
        });
  }

  addProdType(event) {
    event.preventDefault();

    // console.log(this.newTypeProd);

    this.prodTypesService.addProdType(this.newTypeProd).subscribe((resp: any) => {
      const status = resp.status;

      if (status === 'ok') {
        alert('Тип продукта добавлен');
        this.getProdTypes();
        this.newTypeProd  = '';
      } else {
        alert('Произошла ошибка добавления типа продукта');
      }

    });
  }

  updateType(productType) {
    event.preventDefault();


    this.prodTypesService.updateType(productType).subscribe((resp: any) => {
      const status = resp.status;

      if (status === 'ok') {
        alert('Тип продукта обновлен');
        this.getProdTypes();
        this.newTypeProd  = '';
      } else {
        alert('Произошла ошибка изменения типа продукта');
      }

    });
  }


  askDel(productType, event) {
    event.preventDefault();

    if (confirm('Вы уверенны что хотите удалить тип и его характеристики ?')) {
      this.deleteType(productType);
    } else {
      return;
    }
  }


  deleteType(productType) {
    // console.log(productType);

    this.prodTypesService.checkProdsFromType(productType).flatMap( (resp) => {
      if (resp.length > 0) {
        alert('У этого типа присутствуют товары \nсначала удалите их');
        return of();
      }
      return  this.prodTypesService.deleteType(productType);
    }).subscribe( (resp) => {
      const status = resp.status;

      if (status === 'ok') {
        alert('Тип продукта удален');
        this.getProdTypes();
      } else {
        alert('Произошла ошибка удаления типа продукта');
      }

    });



  }
}
