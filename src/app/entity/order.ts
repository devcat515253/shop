import {FullCartItem} from './full-cart-item';

export class Order {
  name: string;
  phone: string;
  email: string;
  selectedCity: string;
  selectedOffice: string;
  address: string;
  cart: FullCartItem[];
  allSumInCart: number;
}
