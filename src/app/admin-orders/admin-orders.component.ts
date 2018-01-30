import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {OrderService} from '../services/order.service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminOrdersComponent implements OnInit, AfterViewInit {

  allSplitedForScroll: any;
  generator: any ;

  allOrders: any;

  searchInput: string = '';
  searchInputPhone: string = '';
  // searchResult: any;
  searchModelChanged: Subject<string> = new Subject<string>();
  searchModelPhoneChanged: Subject<string> = new Subject<string>();

  selectedSort: string = 'Новые';
  sorting = [
    'Новые', 'В обработке', 'Доставленные', 'Откланенные', 'Все'
  ];

  constructor(private orderService: OrderService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit() {
    this.getNewOrder();

    this.searchModelChanged
      .debounceTime(300) // wait 300ms after the last event before emitting last event
      .distinctUntilChanged() // only emit if value is different from previous value
      .subscribe((model) => {
        this.searchInput = model;
        // console.log(this.searchInput);

        if (this.searchInput === '') {
          this.getNewOrder();
        }
        else{
          this.getResSearch();
        }
      });


    this.searchModelPhoneChanged
      .debounceTime(300) // wait 300ms after the last event before emitting last event
      .distinctUntilChanged() // only emit if value is different from previous value
      .subscribe((model) => {
        this.searchInputPhone = model;
        // console.log(this.searchInput);

        if (this.searchInputPhone === '') {
          this.getNewOrder();
        }
        else{
          this.getResSearchByPhone();
        }
      });


  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {


      this.infiniteScroll();

      $( '#phone').on('keyup input', () => {
        this.searchInputPhone =  $('#phone').val();

        // this.searchInputPhone = this.searchInputPhone.split(/\d(?=\D*$)/)[0];  // разделяем строку после последней цифры

        this.searchModelPhoneChanged.next(this.searchInputPhone);
        // console.log( this.searchInputPhone );
      });


      $(document).ready( () => {
        $('#phone').mask('+38 (999) 999-99-99');


      });

    }
  }

  getResSearch() {
    this.orderService.getResSearch(this.searchInput)
      .subscribe(
        (resp) => {
          this.allOrders = resp;
          // this.searchResult = resp;
          //
          // this.searchResult = this.searchResult.filter((order) => order.order_id === +this.searchInput );
          // this.allOrders = this.searchResult;
          // console.log(this.allOrders);
        },
        (err) => {
          console.log('Не удалось получить  заказы для поиска');
          console.log(err);
        });
  }

  getResSearchByPhone() {
    this.orderService.getResSearchByPhone(this.searchInputPhone)
      .subscribe(
        (resp) => {
          this.allOrders = resp;
          // this.searchResult = resp;
          //
          // this.searchResult = this.searchResult.filter((order) => order.order_id === +this.searchInput );
          // this.allOrders = this.searchResult;
          // console.log(this.allOrders);
        },
        (err) => {
          console.log('Не удалось получить  заказы для поиска');
          console.log(err);
        });
  }



  getNewOrder() {
    this.orderService.getNewOrder()
      .subscribe(
        (resp) => {
          // this.allOrders = resp;
          this.splitForScroll(resp);
          // console.log(this.allOrders);
        },
        (err) => {
          console.log('Не удалось получить новые заказы');
          console.log(err);
        });
  }

  getAllOrder() {
    this.orderService.getAllOrder()
      .subscribe(
        (resp) => {
          // this.allOrders = resp;
          this.splitForScroll(resp);
          // console.log(this.allOrders);
        },
        (err) => {
          console.log('Не удалось получить все заказы');
          console.log(err);
        });
  }

  getProcessingOrder() {
    this.orderService.getProcessingOrder()
      .subscribe(
        (resp) => {
          // this.allOrders = resp;
          this.splitForScroll(resp);
        },
        (err) => {
          console.log('Не удалось получить заказы в обработке');
          console.log(err);
        });
  }

  getDoneOrder() {
    this.orderService.getDoneOrder()
      .subscribe(
        (resp) => {
          // this.allOrders = resp;
          this.splitForScroll(resp);
        },
        (err) => {
          console.log('Не удалось получить завершенные заказы');
          console.log(err);
        });
  }

  getRejectedOrder() {
    this.orderService.getRejectedOrder()
      .subscribe(
        (resp) => {
          this.splitForScroll(resp);
          // this.allOrders = resp;
        },
        (err) => {
          console.log('Не удалось получить откланенные заказы');
          console.log(err);
        });
  }



  sortChange(event) {
    // console.log(this.selectedSort);
    if (this.selectedSort === 'Все') {
      this.getAllOrder();
    }

    if (this.selectedSort === 'Новые') {
      this.getNewOrder();
    }

    if (this.selectedSort === 'В обработке') {
      this.getProcessingOrder();
    }

    if (this.selectedSort === 'Доставленные') {
      this.getDoneOrder();
    }

    if (this.selectedSort === 'Откланенные') {
      this.getRejectedOrder();
    }
  }

  searchChange(event) {

    this.searchModelChanged.next(this.searchInput);
  }
  searchPhoneChange() {
    this.searchModelPhoneChanged.next(this.searchInputPhone);
  }

  oderDetail(order) {
    // console.log(order);

    this.router.navigate(['admin/orders', order.order_id]);
  }

  infiniteScroll() {
    $(window).scroll(() => {

      let percentScrolled = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100 ;
      percentScrolled = Math.round(percentScrolled);
      const percent = 70;

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
    this.allOrders = [];
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

      for (let item of pageItems.value) {
        this.allOrders.push(item);
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
