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
export class HeaderComponent implements OnInit , AfterViewInit {
  banerShow = false;
  allCountInCart: number;

  categories: any;
  count: number;

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
      // this.clickOnMenu();
      $(document).ready(() => {
        this.fixedMenu();
        this.menuMobile();
        this.resize();
        this.closeIfClickOutside();

        // $('body').bind('touchstart', function() {});
      });



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

      if (window.matchMedia('(min-width: 992px)').matches) {
        let beggerWindowHeight = $(window).scrollTop() > ($(window).height() - 100) ;

        if  ( beggerWindowHeight )  {
          $('.fixed-menu').fadeIn(200);
        } else {
          $('.fixed-menu').fadeOut(200);
        }
      }

    });
  }


  menuMobile() {

    $('.mobile_nav-link').on('click', function () {
      event.preventDefault();
      $(this).children('.hamburger').toggleClass('is-active');

      let menuBlock = $('.fixed-menu .top-menu');



      // if (menuBlock.is(':visible')) {
      if (menuBlock.is(':hidden')) {
        $('body').addClass('blockScroll');
      }
      else {
        $('body').removeClass('blockScroll');
        $(menuBlock).find('.hiddenData-wr').slideUp();
        $('.dropdown-menu >a').removeClass('rotateAfter');
      }

      menuBlock.fadeToggle(300);


      if ($('.fixed-menu .cart-dropdown .data-dropdown').is(':visible')) {  // закрываем корзину если открыта
        $('.fixed-menu .cart-dropdown .data-dropdown').hide();
        $('.fixed-menu .cart-dropdown .cart-ref').removeClass('hoverCardRef');

      }


    });
  }

  resize() {

    window.addEventListener("orientationchange",  () => {
      this.menuFixToTop();
      this.clickOnMenu();
      this.ptByFixMenu();
      this.clickCartWidget();
    }, false);


    $(window).resize( () => {
      this.menuFixToTop();
      this.clickOnMenu();
      this.ptByFixMenu();
      this.clickCartWidget();
    });

    this.menuFixToTop();
    this.clickOnMenu();
    this.ptByFixMenu();
    this.clickCartWidget();

  }

  menuFixToTop() {
    if (window.matchMedia('(max-width: 991px)').matches) {
      $('.fixed-menu').css({display: 'block' });
    }
    else{
      $('.fixed-menu').css({display: 'none' });
    }
  }


  ptByFixMenu() {
    if (window.matchMedia('(max-width: 991px)').matches) {

        $('main').css({ paddingTop:   $('.fixed-menu .main_menu').height() +  $('.fixed-menu .header__baner').height() - 2}) ;

      $('.fixed-menu .header__baner').off('click', '.btn-close');
      $('.fixed-menu .header__baner').on('click', '.btn-close', function () {

        let heightFixedMainMenu = $('.fixed-menu .main_menu').height() - 2;
        $('main').css({ paddingTop:   heightFixedMainMenu }) ;
      });
    }
    else {
      $('.fixed-menu .header__baner').off('click', '.btn-close');
      $('main').removeAttr( 'style' );
    }

  }

  clickCartWidget() {
    if (window.matchMedia('(max-width: 767px)').matches) {

      $('.fixed-menu .cart-ref span').off();
      $('.fixed-menu .cart-dropdown.dropdown').off();

      $('.fixed-menu .cart-ref span').on('click', function (event) {
          event.stopPropagation();

        if ($('.fixed-menu .top-menu').is(':visible')) {  // закрываем меню если открыто
          $('.fixed-menu .top-menu').fadeOut();
          $('.fixed-menu .hamburger').removeClass('is-active');
          $('body').removeClass('blockScroll');
        }



            let  parent  = $(this).closest('.cart-dropdown');
            let vidgetLink = $(this).closest('.cart-ref');

            let hiddenData =  parent.find('.data-dropdown');
            //if (hiddenData.is(':visible')) {

              if ($(hiddenData).css('display') != 'none') {
              hiddenData.hide();
              vidgetLink.removeClass('hoverCardRef');
                $('body').removeClass('blockScroll');
            }
            else {
              hiddenData.fadeIn();
              vidgetLink.addClass('hoverCardRef');
                $('body').addClass('blockScroll');
            }

          return false;
      });
    }
    else {
      $('body').removeClass('blockScroll');


      $('.fixed-menu .cart-ref span').off();
      $('.fixed-menu .cart-dropdown.dropdown').off();

      let vidgetCart = $('.fixed-menu .cart-dropdown .data-dropdown');
      let vidgetLink = $('.fixed-menu .cart-dropdown .cart-ref');

      $('.fixed-menu .cart-dropdown.dropdown').hover(function () {
          vidgetCart.css({'display': 'flex'});
          vidgetLink.addClass('hoverCardRef');
        },
        function () {
          vidgetCart.css('display', 'none');
          vidgetLink.removeClass('hoverCardRef');
        });
    }
  }

  clickOnMenu() {

    if (window.matchMedia('(max-width: 991px)').matches) {

      $('.dropdown-menu').off();
      $('.dropdown-menu .data-dropdown').removeAttr( 'style' );

      // удаляем обрабутчик предыдущий
        $('.top-menu .dropdown-menu span').off('click');
        $('.top-menu .data-dropdown a').off('click');
        $('.top-menu .dropdown-menu.no-drop span').off();

      $('.top-menu .dropdown-menu span').click(function (event) {
        event.preventDefault();
        event.stopPropagation();




        const li = $(this).closest('.dropdown-menu');
        let hiddenData = li.find('.hiddenData-wr');

        if ($(hiddenData).css('display') == 'none') {
            $(hiddenData).slideDown(500);
            li.find('>a').addClass('rotateAfter');
        }
        else {
            $(hiddenData).slideUp(300);
            li.find('>a').removeClass('rotateAfter');
        }

         return false;
      });

      $('.top-menu .data-dropdown a').click(function (event) {

        $('.hiddenData-wr').hide();
        $('.top-menu').hide();
        $('.hamburger').toggleClass('is-active');
        $('body').removeClass('blockScroll');
        $('.dropdown-menu >a').removeClass('rotateAfter');
      });

      $('.top-menu .dropdown-menu.no-drop span').off('click');

      $('.top-menu .dropdown-menu.no-drop span').click(function () {
        $('.hiddenData-wr').hide();
        $('.top-menu').hide();
        $('.hamburger').toggleClass('is-active');
        $('body').removeClass('blockScroll');
      });
    }
    else {
      // удаляем обрабутчик предыдущий
        $('.top-menu .dropdown-menu span').off('click');
        $('.top-menu .data-dropdown a').off('click');
        $('.top-menu .dropdown-menu.no-drop span').off('click');
        $('.dropdown-menu').off();

      $('.hamburger').removeClass('is-active');               // бургеру убираем класс открытия
      $('.top-menu').removeAttr( 'style' );      // убираем у меню стили примененные js
      $('.hiddenData-wr').removeAttr( 'style' );
      $('.dropdown-menu .data-dropdown').removeAttr( 'style' );
      $('.dropdown-menu >a').removeClass('rotateAfter');
      $('body').removeClass('blockScroll');                    // удаляем блок скрола при открытом меню

      $('.top-menu .dropdown-menu a').click(function (event) {

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

  closeIfClickOutside() {
    $(document).click( function(event) {
      if (window.matchMedia('(min-width: 991px)').matches) {
        return;
      }

      let mobileMenu = $(event.target).closest('.fixed-menu .top-menu').length;
      let mobileMenuLink = $(event.target).closest('.fixed-menu .mobile_nav-link').length;
      let plus = $(event.target).closest('.plus').length;
      let minus = $(event.target).closest('.minus').length;
       let cartWidget = $(event.target).closest('.fixed-menu .top-line__cart').length;
       let quantity__btn = $(event.target).closest('.quantity__btn').length;



      if ( mobileMenuLink || mobileMenu || cartWidget || plus || minus || quantity__btn) // родитель выпадающего списка
        return;

      if ($('.fixed-menu .top-menu').is(':visible')) {
        $('.fixed-menu .top-menu').fadeOut();
        $('.fixed-menu .hamburger').removeClass('is-active');
        $('body').removeClass('blockScroll');
      }

      if ($('.fixed-menu .cart-dropdown .data-dropdown').is(':visible')) {
        $('.fixed-menu .cart-dropdown .data-dropdown').hide();
        $('.fixed-menu .cart-dropdown .cart-ref').removeClass('hoverCardRef');
        $('body').removeClass('blockScroll');
      }

       // $('.fixed-menu .cart-dropdown .data-dropdown').hide();
       // $('.fixed-menu .cart-dropdown .cart-ref').removeClass('hoverCardRef');

      event.stopPropagation();
    });
  }


  clickSearch() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.matchMedia('(min-width: 991px)').matches) {
        return;
      }


      if ($('.fixed-menu .top-menu').is(':visible')) {
        $('.fixed-menu .top-menu').fadeOut();
        $('.fixed-menu .hamburger').removeClass('is-active');
        $('body').removeClass('blockScroll');
      }



    }



  }

}
