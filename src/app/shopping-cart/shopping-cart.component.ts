import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CartService} from '../services/cart.service';
import {FullCartItem} from '../entity/full-cart-item';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class ShoppingCartComponent implements OnInit {
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

    if (new_count <= 1) {
      this.cartService.deletItem(prod_id);
      return;
    }
    new_count--;
    this.cartService.updateCount(prod_id, new_count);
  }
}
