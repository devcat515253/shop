import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../services/product.service';
import {Product} from '../entity/product';
import {isPlatformBrowser} from '@angular/common';
import {Location} from '@angular/common';
import {SeoService} from '../services/seo.service';
import {CategoryService} from '../services/category.service';

declare var $: any;

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.sass']
})
export class ShoppingListComponent implements OnInit, AfterViewInit {
  allSplitedForScroll: any;
  generator: any ;
  currentPage: number = 0;
  countPages: number = 0;

  allProdForSort: Product[] ;


  private categoryUrl: string;
  private nameSubCategory: string;
  category: string;
  subCategory: string;
  products: Product[];
  quickNameProduct: string;

  sort: string  = 'Тип';

  categories: any;



  constructor(private seoService: SeoService,
              private activateRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: string,
              private productService: ProductService,
              private router: Router,
              private location: Location,
              private categoryService: CategoryService) {

  }

  ngOnInit() {

    this.activateRoute.params.subscribe(params => {
      this.categoryUrl = params['categoryUrl'];
      this.nameSubCategory = params['nameSubCategory'];
      this.category = this.categoryUrl;
      this.subCategory = this.nameSubCategory;


      this.categoryService.getCatWithSubCat()
        .subscribe(
          (resp) => {
            this.categories = resp;
            // console.log(this.categories);





            if (this.categoryUrl == 'vendor' && this.categoryUrl && this.nameSubCategory  ) {
              // console.log('vendor');
              this.getByVendor();
              return;
            }

            if (this.categoryUrl && this.nameSubCategory) {
              this.getProdFromSubCategory();

              const subCategory = this.categories.filter(el => el.subcategories.subcategory_url == this.nameSubCategory);

              if (subCategory.length != 0) {
                this.seoService.setTitle(subCategory[0].subcategory_name);
                this.seoService.setDescKeyw(subCategory[0].subcategory_description_seo, subCategory[0].subcategory_keywords_seo);
              }

              return;
            }


            if (this.categoryUrl) {
              this.getProdFromCategory();

              const category = this.categories.filter(el => el.category_url == this.categoryUrl);

              if (category.length != 0) {
                this.seoService.setTitle(category[0].category_name);
                this.seoService.setDescKeyw(category[0].category_description_seo, category[0].category_keywords_seo);
              }

            }

            if (isPlatformBrowser(this.platformId)) {
              $(document).ready(() => {
                $('html, body').animate({scrollTop: 0}, 500);
                this.fadeIn();
              });
            }






          });


    });


  }



  fadeIn() {
    if (isPlatformBrowser(this.platformId)) {
      $('.container').css({'opacity' : '0'});
      $('.container').animate({opacity: 1}, 800);
    }

  }

  getByVendor() {
    this.productService.getByVendor(this.nameSubCategory)
      .subscribe(
        (resp) => {
          this.fadeIn();
          //this.products = resp;


          if (resp.length == 0) {
            return;
          }

          this.allProdForSort = resp;
          this.splitForScroll(resp);




          // this.seoService.setTitle(this.products[0].category_name);
          // this.seoService.setDescKeyw(this.products[0].category_description_seo, this.products[0].category_keywords_seo);


          setTimeout(() => {
            if (isPlatformBrowser(this.platformId)) {
              this.initialMagnific();
            }
          }, 50);

        },
        (err) => {
          console.log('Не удалось получить данные по производителю');
          console.log(err);
        });
  }

  getProdFromCategory() {
    this.productService.getProdFromCategory(this.categoryUrl)
      .subscribe(
        (resp) => {
          this.fadeIn();
          // this.products = resp;

          if (resp.length == 0) {
            return;
          }

          this.allProdForSort = resp;
          this.splitForScroll(resp);
          // setTimeout( () => {
          //   this.splitForScroll(resp);
          // }, 5000);






          setTimeout(() => {
            if (isPlatformBrowser(this.platformId)) {
              this.initialMagnific();
            }
          }, 50);

        },
        (err) => {
          console.log('Не удалось получить данные из категории');
          console.log(err);
        });
  }

  getProdFromSubCategory() {
    this.productService.getProdFromSubCategory(this.nameSubCategory)
      .subscribe(
        (resp) => {
          this.fadeIn();
          // this.products = resp;

          if (resp.length == 0) {
            return;
          }

          this.allProdForSort = resp;
          this.splitForScroll(resp);


          setTimeout(() => {
            if (isPlatformBrowser(this.platformId)) {
              this.initialMagnific();
            }
          }, 50);

        },
        (err) => {
          console.log('Не удалось получить данные из подкатегории');
          console.log(err);
        });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initialMagnific();

      // this.infiniteScroll();
    }
  }

  initialMagnific() {
    $(document).ready( () => {
      $('.popup-with-zoom-anim').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',

        closeBtnInside: true,
        preloader: false,

        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in',
        disableOn: function() {
          if ( $(window).width() < 768 ) {
            return false;
          }
          return true;
        },
        callbacks: {
          beforeOpen: () => { $('body').css({marginRight: this.scrollbarWidth() + 'px' });  $('body').addClass('blockScroll'); },
          // close: () => {  $('body').css({marginRight: this.scrollbarWidth() + 'px' }); $('body').removeClass('blockScroll'); }
          close: () => {  $('body').removeAttr( 'style' ); $('body').removeClass('blockScroll'); }
        }
      });


    });

  }

  overlayClick(event, nameProd) {
     event.preventDefault();
    // event.stopPropagation();
    // console.log(event.target.classList.contains('btn-white'));

    if (event.target.classList.contains('btn-white')) {
      return false;
    }

    this.router.navigate(['/products', nameProd]);

  }

  showShortInfo(product_name: string) {
    this.quickNameProduct = product_name;
    if (isPlatformBrowser(this.platformId)) {
      //$('body').css({marginRight: this.scrollbarWidth() + 'px' });
      //$('body').addClass('blockScroll');


    }
    // console.log(product_name);
  }

   scrollbarWidth() {
     let documentWidth = +document.documentElement.clientWidth;
     let windowsWidth = +window.innerWidth;
     let scrollbarWidth = windowsWidth - documentWidth;
    return scrollbarWidth;
  }

  sortChange(sort) {
    //console.log(this.sort);
    try {

      if ( this.sort === 'возростанию') {
        this.allProdForSort.sort(function (a, b) {
          if (!a.avalible_in_group) {
            return 1;
          }
           return +a.product_price - +b.product_price;
        });

        // проданные в крнец
        this.allProdForSort.sort(function (a, b) {
          if (!a.avalible_in_group) {
            return 1;
          }
          else {
            return -1;
          }
        });

        this.splitForScroll( this.allProdForSort);

      }

      if ( this.sort === 'убыванию') {
        this.allProdForSort.sort(function (a, b) {
          if (!a.avalible_in_group ) {
            return 1;
          }
          return +b.product_price - +a.product_price;
        });

          // проданные в крнец
        this.allProdForSort.sort(function (a, b) {
          if (!a.avalible_in_group) {
            return 1;
          }
          else {
            return -1;
          }
        });

        this.splitForScroll( this.allProdForSort);
      }

      if ( this.sort === 'названию') {
        this.allProdForSort.sort(function (a, b) {
          let compA = a.product_name.toUpperCase();
          let compB = b.product_name.toUpperCase();
          return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });

        // проданные в крнец
        this.allProdForSort.sort(function (a, b) {
          if (!a.avalible_in_group) {
            return 1;
          }
          else {
            return -1;
          }
        });

        this.splitForScroll( this.allProdForSort);
      }

      if (isPlatformBrowser(this.platformId)) {
        $(document).ready(function() {
          $('.container').css({'opacity' : '.5'});
          $('.container').animate({opacity: 1}, 600);
        });
      }

    } catch (er) {}

  }







  infiniteScroll() {
    $(window).scroll(() => {

      let percentScrolled = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100 ;
      percentScrolled = Math.round(percentScrolled);
      const percent = 80;

      if  ( percentScrolled > percent )  {
        this.fillItemsPage();
      }

    });
  }

  splitForScroll(arr) {

    // let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //массив, можно использовать массив объектов
    let array = arr; //массив, можно использовать массив объектов
    let size = 20; //размер подмассива
    let subarray = []; //массив в который будет выведен результат.
    for (let i = 0; i <Math.ceil(array.length/size); i++) {
      subarray[i] = array.slice((i*size), (i*size) + size);
    }
     // console.log(subarray);
    this.allSplitedForScroll = subarray;
    this.products = [];
    this.currentPage = 0;
    this.countPages = this.allSplitedForScroll.length;
    this.generator = generateNewPage(this.allSplitedForScroll);


    this.fillItemsPage();
  }


  fillItemsPage() {

    let pageItems;
    try {
      pageItems = this.generator.next();
    } catch (er) { return; }


    if (!pageItems.done) {
      // this.products = this.products.concat(pageItems.value);
      this.currentPage++;

      for (let item of pageItems.value) {
        this.products.push(item);
      }

      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.initialMagnific();
        }
      }, 50);
    }

  }



  infiniteOnScroll(event) {
    if (isPlatformBrowser(this.platformId)) {

      let percentScrolled = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100 ;
      percentScrolled = Math.round(percentScrolled);
      const percent = 70;

      if  ( percentScrolled > percent )  {
        this.fillItemsPage();
      }
    }

  }

}





function* generateNewPage(arr) {
  for (let page of arr) {
    yield page;

  }
  return 'array end';
}
