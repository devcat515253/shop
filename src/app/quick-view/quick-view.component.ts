import {
  AfterViewInit, Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import {ProductService} from '../services/product.service';
import {isPlatformBrowser} from '@angular/common';
import {Product} from '../entity/product';
import {Router} from '@angular/router';
import {CartService} from '../services/cart.service';
declare var $: any;
@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class QuickViewComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() nameProduct: string;
  count = 1;

  products: Product[];
  selectedProduct: Product;


  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private productService: ProductService,
              private cartService: CartService) { }

  ngOnInit() {
    // this.getProductItem();
  }
  ngOnChanges() {
    this.getProductItem();
  }

  getProductItem() {
    this.productService.getProductItem(this.nameProduct)
      .subscribe(
        (resp) => {
          this.products = resp;

          if (this.products.length == 0) {
            return;
          }

          this.selectedProduct = this.products[0];

          // console.log(this.nameProduct);
          // console.log(this.products);
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
      // $(document).ready(function() {
      //
      //     $('#quantity' ).change(function () {
      //       if ($(this).val() <= 0) {
      //         $(this).val(1);
      //         _this.count = 1;
      //       }
      //       else {
      //         _this.count = parseInt($(this).val(), 10) || 1;
      //       }
      //     });
      // });
    }
  }
  colorChange(color) {
    // console.log('select' + this.selectedProduct.product_color);
    // console.log(color);
    this.products.forEach( (prod, index) => {
      if (prod.product_color === this.selectedProduct.product_color) {
        $('.carousel-container.quick-view .carousel').flickity( 'select', index);
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
  closePopup() {
    $('.mfp-close').trigger('click');
    // this.router.navigate(['/products', product_name]);
    // console.log(product_name);
  }

  addToCart() {
    this.cartService.addToCart(this.selectedProduct.product_id, this.count);
    this.closePopup();
    this.cartService.openQuickCart();

  }

}
