import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CategoryService} from '../services/category.service';
import {of} from 'rxjs/observable/of';

@Component({
  selector: 'app-admin-subcategories',
  templateUrl: './admin-subcategories.component.html',
  styleUrls: ['./admin-subcategories.component.sass'],
 // encapsulation: ViewEncapsulation.None
})
export class AdminSubcategoriesComponent implements OnInit {

  categories: any;
  selectedCat: any;

  subCategories: any;

  newSubCategory = {
    subcategory_name: '',
    subcategory_url: '',
    subcategory_keywords_seo: '',
    subcategory_description_seo: '',
    category_id: 0
  };

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe(
        (resp) => {
          this.categories = resp;

        },
        (err) => {
          console.log('Не удалось получить категории');
          console.log(err);
        });
  }

  getsubCategoriById() {
    this.categoryService.getsubCategoriById(this.selectedCat.category_id)
      .subscribe(
        (resp) => {
          this.subCategories = resp;

        },
        (err) => {
          console.log('Не удалось получить подкатегории');
          console.log(err);
        });
  }

  catChange() {
    // console.log(this.selectedCat);
    this.getsubCategoriById();

  }





  updateSubCat(category, event) {
    event.preventDefault();
    // console.log(category);

    this.categoryService.updateSubCat(category).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Категория обновлена');
      }
      else {
        alert('Произошла ошибка изменения категории');
      }

    });
  }


  ask(subCategory, event) {
    event.preventDefault();
    // console.log(category);

    if (confirm('Вы уверенны что хотите удалить категорию?')) {
      this.deleteSubCat(subCategory);
    } else {
      return;
    }
  }

  deleteSubCat(subcategory) {

    this.categoryService.checkSubCat(subcategory).flatMap(( resp) => {
      if (resp.length > 0) {
        alert('В этой Подкатегории присутствуют товары \nсначала переместите их');
        return of();
      }

      return this.categoryService.deleteSubCat(subcategory);
    }).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('ПодКатегория удалена');
      }
      else {
        alert('Произошла ошибка удаления');
      }

    });
  }


  addSubCat( event) {
    event.preventDefault();
    // console.log(category);

    this.newSubCategory.category_id = this.selectedCat.category_id;

    this.categoryService.addSubCat(this.newSubCategory).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Подкатегория добавлена');
        this.getsubCategoriById();
        this.newSubCategory = {
          subcategory_name: '',
          subcategory_url: '',
          subcategory_keywords_seo: '',
          subcategory_description_seo: '',
          category_id: 0
        };
      }
      else {
        alert('Произошла ошибка добавления подкатегории');
      }

    });
  }


}
