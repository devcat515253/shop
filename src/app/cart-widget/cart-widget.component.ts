import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {CartService} from '../services/cart.service';
import {FullCartItem} from '../entity/full-cart-item';
import {ShortCartItem} from '../entity/short-cart-item';

@Component({
  selector: 'app-cart-widget',
  templateUrl: './cart-widget.component.html',
  styleUrls: ['./cart-widget.component.sass']
})
export class CartWidgetComponent implements OnInit {
  cart: FullCartItem[];
  allCountInCart: number;
  allSumInCart: number;

  constructor(private cartService: CartService) { }

  ngOnInit() {
   this.getCart();
  }


  getCart() {
    this.cartService.getCarttObs().subscribe( (resp) => {
      this.cart = resp;
      // console.log(this.cart);
    });

    this.cartService.getCountObs().subscribe( (resp) => {
      this.allCountInCart = resp;
      // console.log(this.allCountInCart);
    });

    this.cartService.getAllSumObs().subscribe( (resp) => {
      this.allSumInCart = resp;
      // console.log(this.allSumInCart);
    });
  }

  incCount(prod_id, new_count) {
    new_count++;
    this.cartService.updateCount(prod_id, new_count);
  }
  decCount(prod_id, new_count) {
    // console.log(new_count);
    if (new_count <= 1) {
      this.cartService.deletItem(prod_id);
      return;
    }
    new_count--;
    this.cartService.updateCount(prod_id, new_count);
  }


  countChange(prod_id, new_count) {
    if (new_count <= 0) {
      this.cartService.deletItem(prod_id);
      return;
    }
    this.cartService.updateCount(prod_id, +new_count);
  }

}
