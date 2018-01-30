import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../services/product.service';
import {Product} from '../entity/product';
import {isPlatformBrowser} from '@angular/common';
import {Location} from '@angular/common';
import {SeoService} from '../services/seo.service';

declare var $: any;

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.sass']
})
export class ShoppingListComponent implements OnInit, AfterViewInit {
  private categoryUrl: string;
  private nameSubCategory: string;
  category: string;
  subCategory: string;
  products: Product[];
  quickNameProduct: string;

  sort: string  = 'Тип';

  constructor(private seoService: SeoService,
              private activateRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: string,
              private productService: ProductService,
              private router: Router,
              private location: Location) {

  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.categoryUrl = params['categoryUrl'];
      this.nameSubCategory = params['nameSubCategory'];
      this.category = this.categoryUrl;
      this.subCategory = this.nameSubCategory;


      if (this.categoryUrl == 'vendor' && this.categoryUrl && this.nameSubCategory  ) {
        // console.log('vendor');
        this.getByVendor();
        return;
      }

      if (this.categoryUrl && this.nameSubCategory) {
        this.getProdFromSubCategory();
        return;
      }


      if (this.categoryUrl) {
        this.getProdFromCategory();
      }

      if (isPlatformBrowser(this.platformId)) {
        $(document).ready(() => {
          $('html, body').animate({scrollTop: 0}, 500);
         this.fadeIn();
        });
      }

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
          this.products = resp;

          if (this.products.length == 0)
            return;

          this.seoService.setTitle(this.products[0].category_name);
          this.seoService.setDescKeyw(this.products[0].category_description_seo, this.products[0].category_keywords_seo);


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
          this.products = resp;

          if (this.products.length == 0)
            return;

          this.seoService.setTitle(this.products[0].category_name);
          this.seoService.setDescKeyw(this.products[0].category_description_seo, this.products[0].category_keywords_seo);


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
          this.products = resp;

          if (this.products.length == 0)
            return;

          this.seoService.setTitle(this.products[0].subcategory_name);
          this.seoService.setDescKeyw(this.products[0].subcategory_description_seo, this.products[0].subcategory_keywords_seo);

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
        this.products.sort(function (a, b) {
           return +a.product_price - +b.product_price;
        });
      }

      if ( this.sort === 'убыванию') {
        this.products.sort(function (a, b) {
          return +b.product_price - +a.product_price;
        });
      }

      if ( this.sort === 'названию') {
        this.products.sort(function (a, b) {
          let compA = a.product_name.toUpperCase();
          let compB = b.product_name.toUpperCase();
          return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
      }

      if (isPlatformBrowser(this.platformId)) {
        $(document).ready(function() {
          $('.container').css({'opacity' : '.5'});
          $('.container').animate({opacity: 1}, 600);
        });
      }

    } catch (er) {}

  }


}
