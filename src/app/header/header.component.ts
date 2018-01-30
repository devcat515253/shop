import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {CartService} from '../services/cart.service';
import {CategoryService} from '../services/category.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit , AfterViewInit{
  banerShow = false;
  allCountInCart: number;

  categories: any;

  constructor( @Inject(PLATFORM_ID) private platformId: string,
               private cartService: CartService,
               private categoryService: CategoryService
               ) { }

  ngOnInit() {
    this.getCart();
    this.getCatWithSubCat();
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $('.dropdown-menu').on('click', 'a', function (e) {

        const li = $(this).closest('.dropdown-menu');
        li.find('.data-dropdown').hide();

        li.hover(function () {
          li.find('.data-dropdown').css('display', 'flex');
        },
        function () {
         li.find('.data-dropdown').css('display', 'none');
        });

      });

      this.fixedMenu();
    }
  }

  getCart() {
    this.cartService.getCountObs().subscribe( (resp) => {
      this.allCountInCart = resp;
      // console.log(this.allCountInCart);
    });
  }

  getCatWithSubCat() {
    this.categoryService.getCatWithSubCat()
      .subscribe(
        (resp) => {
          this.categories = resp;
          // console.log(this.categories);

        },
        (err) => {
          console.log('Не удалось получить данные по продукту');
          console.log(err);
        });
  }


  fixedMenu() {
    $(window).scroll(() => {

      let beggerWindowHeight = $(window).scrollTop() > ($(window).height() - 100) ;

      if  ( beggerWindowHeight )  {
        $('.fixed-menu').fadeIn(200);
      } else {
        $('.fixed-menu').fadeOut(200);
      }

    });
  }

}
