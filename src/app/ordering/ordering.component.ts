import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {FullCartItem} from '../entity/full-cart-item';
import {CartService} from '../services/cart.service';
import {NovaPoshtaService} from '../services/nova-poshta.service';
import {Order} from '../entity/order';
import {OrderService} from '../services/order.service';
import {isPlatformBrowser} from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class OrderingComponent implements OnInit, AfterViewInit, OnDestroy {
  cart: FullCartItem[];
  allSumInCart: number;

  order: Order;

  allCities = [];
  cities = [];
  offices = [];

  selectedCity: string;
  selectedOffice: string;
  name: string;
  famil: string;
  email: string;
  phone: string;

  hasError: boolean = true;

  intervalId: any;

  hideForm: boolean = false;
  orderSuccess: boolean = false;
  orderError: boolean = false;


  citySearch: string;


  selectedCustomAddress: boolean = false;
  customAddress =  {
    street: '',
    houseNumber: '',
    apartmentNumber: ''
  };

  panelOpenState: boolean;

  // cities1 = [
  //   {value: 'Киев', viewValue: 'Киев'},
  //   {value: 'Запорожье', viewValue: 'Запорожье'},
  //   {value: 'Одесса', viewValue: 'Одесса'}
  // ];

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private cartService: CartService,
              private poshtaService: NovaPoshtaService,
              private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getCart();
    this.getCities();

    this.scrollToTop();

    if (isPlatformBrowser(this.platformId)) {
      $('header, footer').fadeOut(0);
    }
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);

    if (isPlatformBrowser(this.platformId)) {
      $('header, footer').fadeIn(200);
    }
  }

  searchCity() {
    this.cities = this.allCities.filter( (city) => {
      return city.DescriptionRu.toLowerCase().indexOf(this.citySearch.toLowerCase()) === 0 ? true : false ;
    });
}

  clearSelectCities() {
    if ( this.cities.length != 0) {
      return;
    }
    this.cities = this.allCities;
    this.citySearch = '';
  }

  openCities() {
    if (isPlatformBrowser(this.platformId)) {
      $('#city').focus();
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(function() {
        $('html, body').animate({scrollTop: 0}, 500);
      });
    }
  }

  checkName() {
    let name = $('#name');

    let length = name.val().length;

    if (length < 3) {
      name.css({'box-shadow': '0 0 0 2px #d8512d'});
      name.addClass('error');
    }
    else {
      name.css({'box-shadow': '0 0 0 2px #03a196'});
      name.removeClass('error');
    }
  }
  checkFamil() {
    let famil = $('#famil');

    let length = famil.val().length;

    if (length < 3) {
      famil.css({'box-shadow': '0 0 0 2px #d8512d'});
      famil.addClass('error');
    }
    else {
      famil.css({'box-shadow': '0 0 0 2px #03a196'});
      famil.removeClass('error');
    }
  }

  checkPhone() {
    let phone = $( '#phone');
    let length = phone.val().length;
    // console.log(length);
    // console.log(phone.val());

    if (length < 10) {
      phone.css({'box-shadow': '0 0 0 2px #d8512d'});
      phone.addClass('error');
    }
    else {
      phone.css({'box-shadow': '0 0 0 2px #03a196'});
      phone.removeClass('error');
    }
  }

  checkInputs() {
    // Проверка в режиме реального времени

    this.intervalId =  setInterval(() => {
        this.checkName();
        this.checkFamil();
        this.checkPhone();

        // let sizeError;
        //   if (!$('.info').find('error').length) {
        //     sizeError = 0;
        //   }
        //   else {
        //     sizeError = $('.info').find('error').length;
        //   }
        let sizeError = $('.error').length || 0;
        // console.log(sizeError);
        // console.log(this.selectedCity);
        // console.log(this.selectedOffice);


         if (sizeError > 0 || !this.selectedCity ||  (!this.selectedOffice &&  !this.selectedCustomAddress)) {
          this.hasError = true;
        }
        else{
          this.hasError = false;
        }


      }, 500);


  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkInputs();
      $(document).ready( () => {

        $('#phone').mask('+38 (999) 999-99-99');

        $( '#phone').blur(() => {
          this.phone =  $('#phone').val();
          // console.log( this.phone);
        });

        $( '.custom-address .fields').hide();
      });

    }
  }


  customAddrChange() {
    if (isPlatformBrowser(this.platformId)) {
      $( '.custom-address .fields').slideToggle(300);
      $( '.info .office').slideToggle(300);
    }
  }

  phoneChange($event) {
    console.log(event);
  }
  cityChange(event) {
    // console.log(this.selectedCity);
    this.selectedOffice = null;

    this.getOffices();
  }
  officeChange(event) {
    // console.log(this.selectedOffice);
  }
  getOffices() {
    this.poshtaService.getOffices(this.selectedCity).subscribe( (resp) => {
        this.offices = resp.data;
      },
      (error) => {
        console.log(error);
      });
  }

  getCities() {
    this.poshtaService.getCities().subscribe( (resp) => {
      this.cities = [
        {DescriptionRu: 'Киев'},
        {DescriptionRu: 'Днепр'},
        {DescriptionRu: 'Запорожье'},
        {DescriptionRu: 'Одесса'},
        {DescriptionRu: 'Львов'}
        ];
      this.allCities = resp.data;
    },
       (error) => {
        console.log(error);
      });
  }

  getCart() {
    this.cartService.getCarttObs().subscribe( (resp) => {
      this.cart = resp;
      // console.log(this.cart);
      if (this.cart.length === 0) {
        clearInterval(this.intervalId);
      }
    });

    this.cartService.getAllSumObs().subscribe( (resp) => {
      this.allSumInCart = resp;
      // console.log(this.allSumInCart);
    });
  }


  checkPhoneLength() {

    let phone = $( '#phone');
    phone.blur();
    let length = phone.val().length;

    return length;
  }

  confirmOrder() {
    event.preventDefault();

    if (this.checkPhoneLength() < 10) {
      return;
    }

    if  (this.hasError) {
      return;
    }

    let addr: any;
    if (this.selectedCustomAddress) {
      addr = `Курьер ул.${this.customAddress.street}, д.${this.customAddress.houseNumber}, кв.${this.customAddress.apartmentNumber}`;
    }
    else  {
      addr = this.selectedOffice;
    }


    let cartToServ = this.orderService.cartToServ(this.cart);

    this.order = {
      name : this.name,
      famil : this.famil,
      phone : this.phone,
      email : this.email,
      selectedCity : this.selectedCity,
      selectedOffice : addr,
      address : '',
      cart : cartToServ,
      allSumInCart : this.allSumInCart
    };



    this.orderService.addOrder(this.order).subscribe(
      (data: any) => {
        // console.log(data);
        let status = data.status;
        this.hideForm = true;

        if (status === 'ok') {
          this.orderSuccess = true;
          this.cartService.clearCart();
          clearInterval(this.intervalId);
          this.scrollToTop();
        }
        else {
          // this.orderError = true;
          // clearInterval(this.intervalId);
          alert('произошла ошибка добавления заказа, проверьте все поля или свяжитесь с менеджером');
          console.log('произошла ошибка добавления заказа');
        }

      },
      error => console.log(error));

  }



}
