import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ProductService} from '../services/product.service';
import {Product} from '../entity/product';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-promo-slider',
  templateUrl: './promo-slider.component.html',
  styleUrls: ['./promo-slider.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class PromoSliderComponent implements OnInit, AfterViewInit {

  products: Product[];

  quickNameProduct: string;

  constructor(private productService: ProductService,
              @Inject(PLATFORM_ID) private platformId: string,
              private router: Router) { }

  ngOnInit() {
    this.getRandomProds();
  }

  ngAfterViewInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   $('.popup-with-zoom-anim').on(function (event) {
    //     event.preventDefault();
    //   });
    // }
  }

  getRandomProds() {
    this.productService.getRandomProds()
      .subscribe(
        (resp) => {
          this.products = resp;

          if (this.products.length == 0)
            return;



          setTimeout(() => {
            if (isPlatformBrowser(this.platformId)) {
              // this.initialMagnific();
              this.initSlider();
            }
          }, 50);

        },
        (err) => {
          console.log('Не удалось получить рандомные продукты');
          console.log(err);
        });
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
        disableOn: function() {
          // if ( $(window).width() < 768 ) {
          //   return false;
          // }
          return false;
        },
        callbacks: {
          beforeOpen: () => { $('body').css({marginRight: this.scrollbarWidth() + 'px' });  $('body').addClass('blockScroll'); },
          close: () => {  $('body').removeAttr( 'style' ); $('body').removeClass('blockScroll'); }
        }
      });

    });

  }

  scrollbarWidth() {
    let documentWidth = +document.documentElement.clientWidth;
    let windowsWidth = +window.innerWidth;
    let scrollbarWidth = windowsWidth - documentWidth;
    return scrollbarWidth;
  }

  showShortInfo(product_name: string, event) {
    event.preventDefault();
    this.quickNameProduct = product_name;

    this.router.navigate(['/products', product_name]);

  }



  initSlider() {
    $(document).ready(() => {
      $('.promo-slider .items.carousel').flickity({
        // options...
         cellAlign: 'center',
        contain: false,
        autoPlay: 4000,
        // freeScroll: true,
        wrapAround: true,
        pageDots: false,
        accessibility: true,
        selectedAttraction: 0.01,
        friction: 0.15,
        // lazyLoad: true
      });

      // setTimeout(() => {
      //   $('.carousel').flickity('reloadCells');
      //   // console.log('reload slider');
      //   $('.carousel').flickity( 'select', 0 );
      //
      // }, 100);
    });
  }


}


