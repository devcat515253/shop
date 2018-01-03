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



  constructor(private activateRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: string,
              private productService: ProductService,
              private cartService: CartService
             ) {}

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.nameProduct = params['nameProduct'];

      // console.log(this.nameProduct);

      this.getProductItem();
      // window.scrollTo(0, 0);
      if (isPlatformBrowser(this.platformId)) {
        $(document).ready(function() {
          $('html, body').animate({scrollTop: 0}, 500);
          $('.container').css({'opacity' : '0'});
          $('.container').animate({opacity: 1}, 800);
        });
      }
    });
  }



  getProductItem() {
    this.productService.getProductItem(this.nameProduct)
      .subscribe(
        (resp) => {
          this.products = resp;
          this.selectedProduct = this.products[0];
          // console.log(this.products);

        },
        (err) => {
          console.log('Не удалось получить данные по продукту');
          console.log(err);
        });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {

      $(document).ready(function() {
        $().fancybox({
          selector : '[data-fancybox="galleryimg"]',
          loop     : true,
          protect: true
        });

      });

    }
  }

  colorChange(color) {
    // console.log('select' + this.selectedProduct.product_color);
    // console.log(color);
    this.products.forEach( (prod, index) => {
      if (prod.product_color === this.selectedProduct.product_color) {
        $('.carousel').flickity( 'select', index);
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
