import {Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ProductService} from '../services/product.service';
import {CategoryService} from '../services/category.service';
import {Product} from '../entity/product';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-admin-prod-update',
  templateUrl: './admin-prod-update.component.html',
  styleUrls: ['./admin-prod-update.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminProdUpdateComponent implements OnInit {

  formData: FormData;
  product: Product = new Product();
  product_id: number;

  selectImg: string;

  categories: any;
  selectedCategory: any;

  subCategories: any;
  selectedSubCategory: any;

  subCtegoryInProd: any;


  product_options: any;

  constructor(private activateRoute: ActivatedRoute,
              private productService: ProductService,
              private categoryService: CategoryService,
              @Inject(PLATFORM_ID) private platformId: string,
              private location: Location) {


    if (isPlatformBrowser(this.platformId)) {
      this.formData =  new FormData();
    }

  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(function() {
        $('html, body').animate({scrollTop: 0}, 500);
      });
    }
  }

  ngOnInit() {

    this.activateRoute.params.subscribe(params => {
      this.product_id = params['product_id'];
       // console.log(this.product_id);
      this.getProdById();


      this.scrollToTop();
    });
  }

  getOptionsByType() {
    this.productService.getOptionsByType(this.product.product_type)
      .subscribe(
        (resp) => {
          // this.prodTypes = resp;
          this.product_options = resp;

          // console.log(this.product_options);

          this.productService.getOptionsByIdProd(this.product.product_id)
            .subscribe(
              (prod_ops) => {
                // this.prodTypes = resp;


                for (let option of this.product_options) {

                  let optInProdOps = prod_ops.filter((el) => { return el.option_id === option.option_id; });

                  if (optInProdOps[0]) {
                    option.value = optInProdOps[0].option_value;
                  }
                  else {
                    option.value = '';
                  }

                }


                // console.log(prod_ops);
              },
              (err) => {
                console.log('Не удалось получить опции по типу продукта');
                console.log(err);
              });



          // for (let option of this.product_options) {
          //   option.value = '';
          // }


          // console.log(resp);
        },
        (err) => {
          console.log('Не удалось получить опции по типу продукта');
          console.log(err);
        });
  }

  getCatByIdSubCat(sub_category_id) {
    this.categoryService.getCatByIdSubCat(sub_category_id)
      .subscribe(
        (resp) => {
            this.subCtegoryInProd = resp[0];

            this.getCategories();
        },
        (err) => {
          console.log('Не удалось получить категорию по ид subCategory');
          console.log(err);
        });
  }

  getsubCategoriById() {
    this.categoryService.getsubCategoriById(this.selectedCategory.category_id)
      .subscribe(
        (resp) => {
          this.subCategories = resp;

        },
        (err) => {
          console.log('Не удалось получить подкатегории');
          console.log(err);
        });
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe(
        (resp) => {
          this.categories = resp;

          const index = this.categories.findIndex((element) => element.category_id == this.subCtegoryInProd.category_id);

          if (index !== -1) {
            this.selectedCategory = this.categories[index];

            this.categoryService.getsubCategoriById(this.selectedCategory.category_id)
              .subscribe(
                (subCategories) => {
                  this.subCategories = subCategories;
                  const indexSubCat = this.subCategories.findIndex((element) => element.subcategory_id == this.subCtegoryInProd.subcategory_id);
                  if (index !== -1) {
                    this.selectedSubCategory = this.subCategories[indexSubCat];
                  }
                },
                (err) => {
                  console.log('Не удалось получить подкатегории');
                  console.log(err);
                });
          }
        },
        (err) => {
          console.log('Не удалось получить категории');
          console.log(err);
        });
  }

  categoryChange(e) {
     // console.log(this.selectedSubCategory);
    this.getsubCategoriById();
    this.selectedSubCategory = '';
  }

  getProdById() {
    this.productService.getProdFromIdNoImg(this.product_id)
      .subscribe(
        (resp) => {
          if (!resp[0]) {
            if (isPlatformBrowser(this.platformId)) {
              alert('Продукт не найден');
            }
            return;
          }

          this.product = resp[0];
          // console.log(resp);
          this.selectImg = this.product.images_large;

          this.getCatByIdSubCat(this.product.subcategory_id);
          this.getOptionsByType();
        },
        (err) => {
          console.log('Не удалось получить продукт');
          console.log(err);
        });
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;



    if (isPlatformBrowser(this.platformId)) {
      if (fileList.length > 0) {
        this.formData.set('photo', fileList[0], fileList[0].name);
        this.readURL(event.target);
        // console.log(this.formData.getAll('photo'));
      }
      else {
        this.formData.delete('photo');
        // console.log(this.formData.getAll('photo'));
        this.selectImg = '';
      }

    }

  }

  // получить миниатюру выбранной картинки
  readURL(input) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();


      reader.onload = (e) => {
        let target: any = e.target;
        // $('#image').attr('src', e.target.result);
        this.selectImg = target.result;
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  updateProduct() {
    // tslint:disable-next-line:max-line-length
    if (!this.product.product_name || !this.product.product_description || !this.product.product_short_description || !this.product.product_count || !this.product.product_price || !this.product.product_color || !this.product.product_keywords_seo || !this.product.product_description_seo || !this.product.product_manufacturer) {
      alert('Заполните все поля');
      // console.log(this.product);
      return;
    }

    this.product.product_options = this.product_options;

    if (!this.selectedSubCategory) {
      alert('Выберите подкатегорию');
      return;
    }

    if (!this.product.product_available) {
      this.product.product_ispromo = false;
    }


    this.product.subcategory_id = this.selectedSubCategory.subcategory_id;

    this.formData.set('data', JSON.stringify(this.product));

    this.productService.updateProd(this.formData).subscribe((resp) => {
         // console.log(resp);
        let status = resp.status;

        if (status === 'ok') {

          alert(`Продукт c ID ${this.product.product_id} изменен`);
          this.location.back(); // <-- go back to previous location on cancel
        }
        else {
          this.scrollToTop();
          alert('Произошла ошибка изменения продукта, возможно заполнены не все поля');
          console.log('Произошла ошибка изменения продукта, возможно заполнены не все поля');
        }
      },
      error => console.log(error) );

  }

}
