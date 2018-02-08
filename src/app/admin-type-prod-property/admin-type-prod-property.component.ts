import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ProductTypesService} from '../services/product-types.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-admin-type-prod-property',
  templateUrl: './admin-type-prod-property.component.html',
  styleUrls: ['./admin-type-prod-property.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminTypeProdPropertyComponent implements OnInit {

  productTypes: any;
  selectedProdType: any;

  properties: any;

  newProperty: string;

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


  typeChange() {
    // console.log(this.selectedProdType);
    this.getOptionsByType();
  }

  getOptionsByType() {
    this.prodTypesService.getOptionsByType(this.selectedProdType.product_types_id)
      .subscribe(
        (resp) => {
          this.properties = resp;
        },
        (err) => {
          console.log('Не удалось получить опции по типу продукта');
          console.log(err);
        });
  }

  updateProperty(property, event) {
    event.preventDefault();
    // console.log(property);

    this.prodTypesService.updateProperty(property.option_name, property.option_id).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Характеристика обновлена');
        this.getOptionsByType();
      }
      else {
        alert('Произошла ошибка обновления характеристики');
      }

    });
  }

  askDel(property, event) {
    event.preventDefault();

    if (confirm('Вы уверенны что хотите удалить характеристику у всех продуктов?')) {
      this.deleteProperty(property);
    } else {
      return;
    }
  }


  deleteProperty(property) {
    // console.log(property);

    this.prodTypesService.deleteProperty(property.option_id).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Характеристика удалена');
        this.getOptionsByType();
      }
      else {
        alert('Произошла ошибка удаления характеристики');
      }

    });


  }

  addProperty(event) {
    event.preventDefault();

    // console.log(this.newProperty);

    this.prodTypesService.addProperty(this.newProperty, this.selectedProdType.product_types_id).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Характеристика добавлена');
        this.getOptionsByType();
        this.newProperty = '';
      }
      else {
        alert('Произошла ошибка добавления характеристики');
      }

    });

  }
}
