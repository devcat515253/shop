import {Inject, Injectable, OnInit, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ShortCartItem} from '../entity/short-cart-item';
import {FullCartItem} from '../entity/full-cart-item';
import {Product} from '../entity/product';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/observable/from';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {logger} from 'codelyzer/util/logger';
import {isPlatformBrowser} from '@angular/common';
declare var $: any;

@Injectable()
export class CartService {
  shortCart: ShortCartItem[] = [];
  fullCart: FullCartItem[] = [];
  products: Product[];
  baseUrl  = 'http://localhost:8000';
  allCount: number;
  allSum: number;
  observableAllCount = new BehaviorSubject<number>(0);
  observableFullCart = new BehaviorSubject<FullCartItem[]>([]);
  observableAllSum = new BehaviorSubject<number>(0);
  // observableFullCart = new Subject<FullCartItem[]>();

  constructor(private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: string) {

    this.getCart();
  }

  getCarttObs() {
    return this.observableFullCart.asObservable();
  }
  getCountObs() {
    return this.observableAllCount.asObservable();
  }
  getAllSumObs() {
    return this.observableAllSum.asObservable();
  }

  emitNewValues () {
    this.getAllCount();
    this.getAllSum();
    this.observableFullCart.next(this.fullCart);
    this.observableAllCount.next(this.allCount);
    this.observableAllSum.next(this.allSum);
  }


  getAllProducts() {
    return this.http.get<Product[]>(`${this.baseUrl}/api/getAllProduct` );
  }
  getShortCart() {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('shortCart')) || [];
    }
    return [];
  }

  getAllCount() {
    this.allCount = 0;
    for (let item of this.shortCart) {
      this.allCount += item.count;
    }
  }

  getAllSum() {
    this.allSum = 0;
    for (let item of this.fullCart) {
      if ( item.product.product_promo_price) {
        this.allSum += item.product.product_promo_price * item.count;
        continue;
      }
      this.allSum += item.product.product_price * item.count;
    }
  }


  addToCart(prod_id, count) {
    const newItem = {
      product_id: prod_id,
      count: count
    };

    const prodInProducts = this.shortCart.filter((prod) => prod.product_id === prod_id );

    if (prodInProducts.length > 0) {
      this.updateCountExistProd(prod_id, count);
    }
    else {
      this.shortCart.push(newItem);

      this.saveToLocalStor();
      this.initFullCart();

      this.emitNewValues();
    }
  }

  saveToLocalStor() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('shortCart', JSON.stringify(this.shortCart));
    }
  }

  updateCountExistProd(prod_id, count) {
    const index = this.shortCart.findIndex((element) => element.product_id === prod_id);
    if (index > -1) {
      this.shortCart[index].count += count;

      this.saveToLocalStor();
      this.initFullCart();

      this.emitNewValues();
    }
  }

  updateCount(prod_id, count) {
    const index = this.shortCart.findIndex((element) => element.product_id === prod_id);
    if (index > -1) {
      this.shortCart[index].count = count;

      this.saveToLocalStor();
      this.initFullCart();

      this.emitNewValues();
    }
  }

  deletItem(prod_id) {
    const index = this.shortCart.findIndex((element) => element.product_id === prod_id);
    if (index > -1) {
      this.shortCart.splice(index, 1);

      this.saveToLocalStor();
      this.initFullCart();

      this.emitNewValues();
    }
  }

  initFullCart() {
    this.fullCart = [];

    for (let shortItem of this.shortCart) {
      const prodInProducts = this.products.filter((prod) => prod.product_id === shortItem.product_id );
      const fullItemCart = {
            product: prodInProducts[0],
            count: shortItem.count
          };
      this.fullCart.push(fullItemCart);
    }
  }

  getCart() {
    this.getAllProducts().subscribe((resp) => {
        this.products = resp;
        // console.log(this.products);
        this.shortCart = this.getShortCart();
        this.initFullCart();

        this.emitNewValues();
      },
      (err) => {
        console.log('Не удалось получить продукты');
        console.log(err);
      });
  }

  openQuickCart() {
    if (isPlatformBrowser(this.platformId)) {

      let vidgetCart = $('.cart-dropdown .data-dropdown');
      let vidgetLink = $('.cart-dropdown .cart-ref');

      vidgetCart.css({'display': 'flex'});
      vidgetLink.addClass('hoverCardRef');

      $('.cart-dropdown.dropdown').hover(function () {
          vidgetCart.css({'display': 'flex'});
          vidgetLink.addClass('hoverCardRef');
        },
        function () {
          vidgetCart.css('display', 'none');
          vidgetLink.removeClass('hoverCardRef');
        });

    }
  }

  clearCart() {
    // localStorage.clear();
     localStorage.removeItem('shortCart');
    this.getCart();
    this.emitNewValues();
  }

}
