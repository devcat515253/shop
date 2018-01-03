import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {CartService} from '../services/cart.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit , AfterViewInit{
  banerShow = false;
  allCountInCart: number;

  constructor( @Inject(PLATFORM_ID) private platformId: string,
               private cartService: CartService) { }

  ngOnInit() {
    this.getCart();
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
    }
  }

  getCart() {
    this.cartService.getCountObs().subscribe( (resp) => {
      this.allCountInCart = resp;
      // console.log(this.allCountInCart);
    });
  }

}
