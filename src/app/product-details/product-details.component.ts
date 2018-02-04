import {AfterViewInit, Component, OnInit, PLATFORM_ID, Inject, ElementRef, HostBinding, OnChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {isPlatformBrowser} from '@angular/common';

import {HttpClient} from '@angular/common/http';
import {ProductService} from '../services/product.service';
import {Product} from '../entity/product';
import {CartService} from '../services/cart.service';
import {fadeInAnimation} from '../_animations/fade-in.animation';
declare var $: any;
// import * as $ from 'jquery';
 // import * as flickity from 'flickity';


import { trigger, state, animate, transition, style } from '@angular/animations';
import {Meta, Title} from '@angular/platform-browser';
import {SeoService} from '../services/seo.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.sass']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  //  testBrowser: boolean;
  count = 1;
  private nameProduct: string;

  products: Product[];
  selectedProduct: Product;


  idProduct: number;


  constructor(private seoService: SeoService,
              private activateRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: string,
              private productService: ProductService,
              private cartService: CartService,
              public meta: Meta, public title: Title
             ) {}

  ngOnInit() {

    this.activateRoute.params.subscribe(params => {
      this.nameProduct = params['nameProduct'];
      this.idProduct = params['idProduct'];

      // console.log(this.nameProduct);

      this.getProductItem();



      // window.scrollTo(0, 0);
      if (isPlatformBrowser(this.platformId)) {
        $(document).ready(() => {
          $('html, body').animate({scrollTop: 0}, 500);
          if (!this.idProduct) {
            $('.container').css({'opacity': '0'});
            $('.container').animate({opacity: 1}, 800);
          }
        });
      }
    });
  }

seo (prod) {

  // Sets the <title></title>
  this.title.setTitle(prod.product_name);

  // Sets the <meta> tag for the page
  this.meta.addTags([
    { name: 'author', content: 'Shisha.com.ua' },
    { name: 'description', content: prod.product_description_seo },
    { name: 'keywords', content: prod.product_keywords_seo }
  ]);

}

  getProductItem() {
    this.productService.getProductItem(this.nameProduct)
      .subscribe(
        (resp) => {
          this.products = resp;
          // this.selectedProduct = this.products[0];
           // console.log(this.products);
          // this.seo(this.selectedProduct);
          if (this.products.length == 0){
            return;
          }


          if (this.idProduct) {
            this.selectedProduct = this.products.filter(prod => prod.product_id == this.idProduct)[0];

            this.seoService.setTitle(this.selectedProduct.product_name);
            this.seoService.setDescKeyw(this.selectedProduct.product_description_seo, this.selectedProduct.product_keywords_seo);

            if (isPlatformBrowser(this.platformId)) {
              $(document).ready(() => {

                this.products.forEach( (prod, index) => {
                  if (prod.product_color === this.selectedProduct.product_color) {

                    setTimeout(function () {
                      $('.carousel-container.prod .carousel').flickity( 'select', index);
                    }, 800);


                  }
                });

              });
            }

          } else {
            this.selectedProduct = this.products[0];

            this.seoService.setTitle(this.selectedProduct.product_name);
            this.seoService.setDescKeyw(this.selectedProduct.product_description_seo, this.selectedProduct.product_keywords_seo);
          }



        },
        (err) => {
          console.log('Не удалось получить данные по продукту');
          console.log(err);
        });
  }

  countChange() {
    if (this.count <= 0) {
      this.count = 1;
    }
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
          // let _this = this;
      $(document).ready(function() {

        // $('#quantity' ).change(function () {
        //   if ($(this).val() <= 0) {
        //     $(this).val(1);
        //     _this.count = 1;
        //   }
        //   else {
        //     _this.count = parseInt($(this).val(), 10) || 1;
        //   }
        // });

        $().fancybox({
          selector : '[data-fancybox="galleryimg"]',
          loop     : true,
          protect: true
        });

      });

    }
  }



  colorChange(color) {
    // this.seo(this.selectedProduct);
    // console.log('select' + this.selectedProduct.product_color);
    // console.log(color);
    // this.seoService.setTitle(this.selectedProduct.product_name);
    // this.seoService.setDescKeyw(this.selectedProduct.product_description_seo, this.selectedProduct.product_keywords_seo);

    this.products.forEach( (prod, index) => {
      if (prod.product_color === this.selectedProduct.product_color) {
        $('.carousel-container.prod .carousel').flickity( 'select', index);
      }
    });
  }



  incCount() {
    this.count++;
  }
  decCount() {
    if (this.count <= 1) {
      return;
    }
    this.count--;
  }

  addToCart() {
    this.cartService.addToCart(this.selectedProduct.product_id, this.count);
    this.cartService.openQuickCart();
  }

}
