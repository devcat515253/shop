import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CategoryService} from '../services/category.service';
import {isPlatformBrowser} from '@angular/common';
import {of} from 'rxjs/observable/of';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminCategoriesComponent implements OnInit {


  newCategory = {
    category_name: '',
    category_url: '',
    category_keywords_seo: '',
    category_description_seo: ''
  };

  categories: any;

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


  updateCat(category, event) {
    event.preventDefault();
    // console.log(category);

    this.categoryService.updateCat(category).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Категория обновлена');
      }
      else {
        alert('Произошла ошибка изменения категории');
      }

    });
  }


  ask(category, event) {
    event.preventDefault();
    // console.log(category);

    if (confirm('Вы уверенны что хотите удалить категорию?')) {
      this.deleteCat(category);
    } else {
      return;
    }
  }

  deleteCat(category) {

    this.categoryService.checkCat(category).flatMap(( resp) => {
      if (resp.length > 0) {
        alert('В этой категории присутствуют подкатегории \nсначала переместите их');
        return of();
      }

      return this.categoryService.deleteCat(category);
    }).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Категория удалена');
      }
      else {
        alert('Произошла ошибка удаления');
      }

    });
  }


  addCat( event) {
    event.preventDefault();
    // console.log(category);

    this.categoryService.addCat(this.newCategory).subscribe((resp: any) => {
      let status = resp.status;

      if (status === 'ok') {
        alert('Категория добавлена');
        this.getCategories();
        this.newCategory  = {
          category_name: '',
          category_url: '',
          category_keywords_seo: '',
          category_description_seo: ''
        };
      }
      else {
        alert('Произошла ошибка добавления категории');
      }

    });
  }


}
