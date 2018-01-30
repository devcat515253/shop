import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {ProductService} from '../services/product.service';
import {Product} from '../entity/product';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {isPlatformBrowser} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-admin-prods',
  templateUrl: './admin-prods.component.html',
  styleUrls: ['./admin-prods.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminProdsComponent implements OnInit, AfterViewInit {

  allSplitedForScroll: any;
  generator: any ;

  products: any = [];
  selectedProdForDelete: any;

  selectedTypeProd: any;
  prodTypes: any;

  searchInputById: string;
  searchInputByName: string;

  searchInputByIdChanged: Subject<string> = new Subject<string>();
  searchInputByNameChanged: Subject<string> = new Subject<string>();

  constructor(private productService: ProductService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: string) {
  }

  ngOnInit() {
    this.getProdTypes();
    this.getLastProds();
    this.inputNameChange();
    this.inputIdChange();
  }

  inputIdChange() {
    this.searchInputByIdChanged
      .debounceTime(300) // wait 300ms after the last event before emitting last event
      .distinctUntilChanged() // only emit if value is different from previous value
      .subscribe((model) => {
        this.searchInputById = model;
        // console.log(this.searchInput);

        if (this.searchInputById === '') {
          this.getLastProds();

          this.selectedTypeProd = this.prodTypes[this.prodTypes.length - 1];
        }
        else{
          this.searchById();
        }
      });
  }

  inputNameChange() {
    this.searchInputByNameChanged
      .debounceTime(300) // wait 300ms after the last event before emitting last event
      .distinctUntilChanged() // only emit if value is different from previous value
      .subscribe((model) => {
        this.searchInputByName = model;
        // console.log(this.searchInput);

        if (this.searchInputByName === '') {
          this.getLastProds();
          this.selectedTypeProd = this.prodTypes[this.prodTypes.length - 1];
        }
        else{
          this.searchByName();
        }
      });
  }

  searchById() {
    this.productService.getProdsForSearch()
      .subscribe(
        (resp) => {
          this.products = resp.filter((prod) => {

            let index = prod.product_id.toString().indexOf(this.searchInputById);

            if (index >= 0 ) {
              return true;
            }
            else {
              return false;
            }

          });
          // this.searchResult = resp;
          //
          // this.searchResult = this.searchResult.filter((order) => order.order_id === +this.searchInput );
          // this.allOrders = this.searchResult;
          // console.log(this.allOrders);
          if (isPlatformBrowser(this.platformId)) {
            this.initialMagnific();
          }
        },
        (err) => {
          console.log('Не удалось получить  заказы для поиска');
          console.log(err);
        });
  }

  searchByName() {
    this.productService.getProdsForSearch()
      .subscribe(
        (resp) => {
          this.products = resp.filter((prod) => {

            let index = prod.product_name.toLowerCase().indexOf(this.searchInputByName.toLowerCase());

            if (index >= 0 ) {
              return true;
            }
            else {
              return false;
            }

          });
          // this.searchResult = resp;
          //
          // this.searchResult = this.searchResult.filter((order) => order.order_id === +this.searchInput );
          // this.allOrders = this.searchResult;
          // console.log(this.allOrders);
          if (isPlatformBrowser(this.platformId)) {
            this.initialMagnific();
          }
        },
        (err) => {
          console.log('Не удалось получить  заказы для поиска');
          console.log(err);
        });
  }

  getProdTypes() {
    this.productService.getProdTypes()
      .subscribe(
        (resp) => {
          this.prodTypes = resp;

          let item = {
             // product_types_id: 99999999999999,
            product_types_name: 'Последние добавленные'
          };
          this.selectedTypeProd = item;

          this.prodTypes.push(item);

        },
        (err) => {
          console.log('Не удалось получить типы продуктов');
          console.log(err);
        });
  }

  getLastProds() {
    this.productService.getLastProds()
      .subscribe(
        (resp) => {
          // this.products = resp;
          // let res = [];
          // for (let i=0;i<1000;i++) {
          //    res = resp.concat(res) ;
          // }
          // console.log(res);
          this.splitForScroll(resp);

          // console.log( this.products );
          if (isPlatformBrowser(this.platformId)) {
            this.initialMagnific();
          }
        },
        (err) => {
          console.log('Не удалось получить последние продукты');
          console.log(err);
        });
  }

  getProdsByType() {
    this.productService.getProdsByType(this.selectedTypeProd.product_types_name)
      .subscribe(
        (resp) => {
          this.splitForScroll(resp);
          // this.products = resp;
           // console.log( this.products );
          if (isPlatformBrowser(this.platformId)) {
            this.initialMagnific();
          }
        },
        (err) => {
          console.log('Не удалось получить продукты по типу');
          console.log(err);
        });
  }

  typeProdChange(e) {
    // console.log(this.selectedTypeProd);
    if (this.selectedTypeProd.product_types_name === 'Последние добавленные') {
      this.getLastProds();
      return;
    }
    this.getProdsByType();

  }

  inputByIdChange(e) {
    // console.log(this.searchInputById);
    this.searchInputByIdChanged.next(this.searchInputById);
  }

  inputByNameChange(e) {
    // console.log(this.searchInputByName);
    this.searchInputByNameChanged.next(this.searchInputByName);
  }

  statusProdChange(product) {
    // console.log(product);
  }

  isPromoProdChange(product) {
    // console.log(product);
  }



  edit(product) {
    // console.log(product);
    // console.log('edit');

     this.router.navigate(['admin/prods/update', product.product_id]);
  }

  delete(event) {
    event.preventDefault();
    $('.mfp-close').trigger('click');
    // console.log(product);
    // console.log('delete');

    this.productService.deleteProd(this.selectedProdForDelete)
      .subscribe(
        (resp) => {
          let status = resp.status;
          let prod = resp.data;

          if (status === 'ok') {
            alert(`Продукт c ID ${prod.product_id} удален`);
            if (this.selectedTypeProd.product_types_name === 'Последние добавленные') {
              this.getLastProds();
              return;
            }
            this.getProdsByType();
          }
          else {
            alert('Произошла ошибка удаления продукта');
          }
        },
        (err) => {
          console.log('Не удалось удалить товар');
          console.log(err);
        });
    this.selectedProdForDelete = null;
  }


  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initialMagnific();

      this.infiniteScroll();

    }
  }

  initialMagnific() {
    $(document).ready( () => {

      $('.popup-with-zoom-anim').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',

        closeBtnInside: true,
        preloader: false,

        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in',
        // callbacks: {
        //   beforeOpen: () => { $('body').css({marginRight: this.scrollbarWidth() + 'px' });  $('body').addClass('blockScroll'); },
        //   close: () => {  $('body').css({marginRight: this.scrollbarWidth() + 'px' }); $('body').removeClass('blockScroll'); }
        // }
      });


    });

  }
  closePopup(event) {
    event.preventDefault();
    $('.mfp-close').trigger('click');
  }

  infiniteScroll() {
    $(window).scroll(() => {

      let percentScrolled = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100 ;
      percentScrolled = Math.round(percentScrolled);
      const percent = 80;

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
    this.products = [];
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
        this.products.push(item);
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
