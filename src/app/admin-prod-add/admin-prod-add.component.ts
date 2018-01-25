import {Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {ProductService} from '../services/product.service';
import {Product} from '../entity/product';
import {isPlatformBrowser} from '@angular/common';
import {CategoryService} from '../services/category.service';

declare var $: any;

@Component({
  selector: 'app-admin-prod-add',
  templateUrl: './admin-prod-add.component.html',
  styleUrls: ['./admin-prod-add.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminProdAddComponent implements OnInit {

  selectedTypeProd: any = 'Тип';
  prodTypes: any;
  product: Product = new Product();
  product_options: any;
  formData: FormData;

  categories: any;
  selectedCategory: any;

  subCategories: any;
  selectedSubCategory: any;

  selectImg: string;


  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              @Inject(PLATFORM_ID) private platformId: string) {

    this.product.product_status = 'Опубликован';

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
    this.getProdTypes();
    this.getCategories();

   this.scrollToTop();
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

        },
        (err) => {
          console.log('Не удалось получить категории');
          console.log(err);
        });
  }

  getProdTypes() {
    this.productService.getProdTypes()
      .subscribe(
        (resp) => {
          this.prodTypes = resp;

        },
        (err) => {
          console.log('Не удалось получить типы продуктов');
          console.log(err);
        });
  }

  getOptionsByType() {
    this.productService.getOptionsByType(this.selectedTypeProd.product_types_id)
      .subscribe(
        (resp) => {
          // this.prodTypes = resp;
          this.product_options = resp;

          for (let option of this.product_options) {
            option.value = '';
          }


          // console.log(resp);
        },
        (err) => {
          console.log('Не удалось получить опции по типу продукта');
          console.log(err);
        });
  }

  typeProdChange(e) {
     // console.log(this.selectedTypeProd);
     this.getOptionsByType();
  }

  categoryChange(e) {
    // console.log(this.selectedCategory);
     this.getsubCategoriById();
    this.selectedSubCategory = '';
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
      // this.formData = new FormData();
      // formData.append('photo', fileList[0]);
      // formData.append('uploadFile', fileList[0], fileList[0].name);

      // this.formData.set('photo', fileList[0], fileList[0].name);
      // this.readURL(event.target);

      // this.selectImg = `assets/img/products/${fileList[0].name}`;


      // для нескольких файлов
      // for (let i = 0; i < fileList.length; i++) {
      //   this.formData.append('photo', fileList[i], fileList[i].name);
      // }
    }



    // console.log(event);
    // console.log(fileList);
     // console.log(this.formData.getAll('photo'));


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

  saveProduct() {
    // tslint:disable-next-line:max-line-length
    if (!this.product.product_name || !this.product.product_description || !this.product.product_short_description || !this.product.product_count || !this.product.product_price || !this.product.product_color || !this.product.product_keywords_seo || !this.product.product_description_seo || !this.product.product_manufacturer) {
      alert('Заполните все поля');
      // console.log(this.product);
      return;
    }


    if (!this.selectedTypeProd) {
      alert('Выберите тип продукта');
      return;
    }
    this.product.product_options = this.product_options;
    this.product.product_type = this.selectedTypeProd.product_types_id;

    if (!this.product.product_ispromo) {
      this.product.product_ispromo = false;
    }

    if (!this.formData.getAll('photo')) {
      alert('Выберите картинку');
      return;
    }
    // console.log(this.formData.getAll('photo'));
    if (!this.selectedSubCategory) {
      alert('Выберите подкатегорию');
      return;
    }

    if (!this.product.product_promo_price) {
      this.product.product_promo_price = null;
    }


    this.product.subcategory_id = this.selectedSubCategory.subcategory_id;

    // this.formData.set('data', JSON.stringify(this.product));
    this.formData.set('data', JSON.stringify(this.product));


    this.productService.addNewProd(this.formData).subscribe((resp) => {
        // console.log(resp);
        let status = resp.status;

        if (status === 'ok') {
          this.scrollToTop();
          alert('Продукт добквлен, можете добавить еще');
        }
        else {
          this.scrollToTop();
          alert('Произошла ошибка добавления продукта, возможно заполнены не все поля');
          console.log('Произошла ошибка добавления продукта, возможно заполнены не все поля');
        }
    },
      error => console.log(error) );


    // console.log(this.product);
    // console.log(this.formData.getAll('photo'));
    // console.log(this.formData.getAll('data'));
  }

}
