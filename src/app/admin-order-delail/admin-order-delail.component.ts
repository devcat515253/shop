import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
// import {$} from '../product-details/product-details.component';
import {isPlatformBrowser, Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {OrderService} from '../services/order.service';
import {ProductService} from '../services/product.service';

declare var $: any;

@Component({
  selector: 'app-admin-order-delail',
  templateUrl: './admin-order-delail.component.html',
  styleUrls: ['./admin-order-delail.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminOrderDelailComponent implements OnInit , AfterViewInit{

  order_id: number;

  order: any;
  order_prods: any;

  selectedStatus: string;
  statuses = [
    'Новый', 'В обработке', 'Доставлен', 'Откланен'
  ];

  addNewProdError: boolean;

  constructor(private activateRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: string,
              private orderService: OrderService,
              private productService: ProductService,
              private location: Location) { }

  ngOnInit() {

    this.activateRoute.params.subscribe(params => {
      this.order_id = params['order_id'];
      // console.log(this.order_id);

      this.getOrder();
      this.getOrderProds();

      if (isPlatformBrowser(this.platformId)) {
        $(document).ready(function() {
          $('html, body').animate({scrollTop: 0}, 500);
        });
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready( () => {

        $('#phone').mask('+38 (999) 999-99-99');

        $( '#phone').blur(() => {
          this.order.order_phone_customer =  $('#phone').val();
          // console.log( this.phone);
        });

      });

    }
  }


  getOrder() {
    this.orderService.getOrder(this.order_id)
      .subscribe(
        (resp) => {
          this.order = resp[0];
          this.selectedStatus = this.order.order_status;
          // console.log(this.order );
          // console.log(this.selectedStatus );
        },
        (err) => {
          console.log('Не удалось получить заказ по ид');
          console.log(err);
        });
  }

  getOrderProds() {
    this.orderService.getOrderProds(this.order_id)
      .subscribe(
        (resp) => {
          this.order_prods = resp;
           // console.log(this.order_prods );
        },
        (err) => {
          console.log('Не удалось получить продукты по ид');
          console.log(err);
        });
  }


  // statusChange (status) {
  //   // console.log(status);
  //   // this.order.order_status = this.selectedStatus;
  //
  // }

  deleteItem(prod) {
    const index = this.order_prods.indexOf(prod);
    if (index > -1) {
      this.order_prods.splice(index, 1);
      this.calculateSumm();
    }
  }

  incCount(index) {
    // console.log(index);
    // console.log(this.order_prods[index]);

    this.order_prods[index].order_prod_count++;
    this.calculateSumm();
  }
  decCount(index) {
    if (this.order_prods[index].order_prod_count <= 1) {
      return;
    }
    this.order_prods[index].order_prod_count--;
    this.calculateSumm();
  }

  countChange(index) {
    if ( this.order_prods[index].order_prod_count <= 0) {
      this.order_prods[index].order_prod_count = 1;
    }
    this.calculateSumm();
  }


  calculateSumm() {
    this.order.order_sum = 0;

    for (let prod of this.order_prods) {
      if ( prod.order_prod_promo_price) {
        this.order.order_sum += prod.order_prod_promo_price * prod.order_prod_count;
        continue;
      }
      this.order.order_sum  += prod.order_prod_price * prod.order_prod_count ;
    }
  }



  addNewProdInOrd(newProdId) {
    // console.log(newProdId);

    this.productService.getProdFromID(newProdId)
      .subscribe(
        (resp: any) => {
          if (!resp[0]) {
            this.addNewProdError = true;
            return;
          } else {
            this.addNewProdError = false;
          }

          let newItemProd = resp[0];

          if (this.order_prods.findIndex( (prod) =>  prod.product_id === newItemProd.product_id ) !== -1) {
            alert('Продукт уже есть в заказе');
            return;
          }

          if (!newItemProd.product_available ) {
            alert('Продукта нет на складе');
            return;
          }
          if (newItemProd.product_status == 'Скрыт') {
            alert('Этот продукт скрыт');
            return;
          }

          newItemProd.order_prod_count = 1;
          newItemProd.order_prod_price = newItemProd.product_price;

          if (newItemProd.product_promo_price) {
            newItemProd.order_prod_promo_price = newItemProd.product_promo_price;
          }


          this.order_prods.push(newItemProd);
          this.calculateSumm();
          // console.log(newItemProd);

        },
        (err) => {
          console.log('Не удалось получить продукт');
          console.log(err);
        });
  }

  saveOrder() {
    event.preventDefault();


    this.order.cart = this.orderService.cartToServUpdateProds(this.order_prods);

    // console.log(this.order);
    // console.log(this.order_prods);


    this.orderService.updateOrder(this.order).subscribe((resp: any) => {
         // console.log(resp);
        let status = resp.status;

        if (status === 'ok') {

          alert(`Заказ c ID ${this.order.order_id} изменен`);
          this.location.back(); // <-- go back to previous location on cancel
        }
        else {
          this.scrollToTop();
          alert('Произошла ошибка изменения заказа, возможно заполнены не все поля');
          console.log('Произошла ошибка изменения заказа, возможно заполнены не все поля');
        }
      },
      error => console.log(error) );


  }


  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(function() {
        $('html, body').animate({scrollTop: 0}, 500);
      });
    }
  }

}
