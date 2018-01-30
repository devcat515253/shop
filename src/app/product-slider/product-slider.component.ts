import {
  AfterContentChecked, AfterContentInit,
  AfterViewChecked, AfterViewInit, Component, DoCheck, Inject, Input, OnChanges, OnInit, PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Product} from '../entity/product';
import {ProductService} from '../services/product.service';

declare var $: any;

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.sass'],
  // encapsulation: ViewEncapsulation.None
  // encapsulation: ViewEncapsulation.Emulated
})
export class ProductSliderComponent implements OnInit, AfterViewInit , OnChanges {
  @Input() nameProduct: string;
  products: Product[];
  isFlickity = false;


  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private productService: ProductService) { }

  ngOnInit() {
    // this.getProductItem();
  }
  ngOnChanges() {
    this.getProductItem();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        // this.initialSlider();
      $(document).ready(() => {
       // this.initialSlider();

        // setTimeout( () => {
        //   // $('.carousel').flickity( 'select', 0 );
        //   // $('.carousel-nav').find('.carousel-cell').addClass('is-nav-selected');
        //     this.initialSlider();
        // }, 600);
      });
    }
  }

  getProductItem() {
    this.productService.getProductItem(this.nameProduct)
      .subscribe(
        (resp) => {
          this.products = resp;

          setTimeout( () => {
            if (isPlatformBrowser(this.platformId)) {
              this.initialSlider();
            }
          }, 50);


        },
        (err) => {
          console.log('Не удалось получить данные по продукту');
          console.log(err);
        });
  }
  getProductItem1() {
    this.productService.getProductItem(this.nameProduct)
      .subscribe(
        (resp) => {
          this.products = resp;
          setTimeout(() => {
              $('.carousel-container.prod .carousel').flickity('destroy');
              this.initialSlider();
              console.log('reload2');
          }, 50);

        },
        (err) => {
          console.log('Не удалось получить данные по продукту');
          console.log(err);
        });
  }


  ngAfterContentInit1() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.carousel-container.prod .carousel').flickity('reloadCells');
        console.log('reload2');
      }, 50);
    }
  }

  initialSlider() {
    $(document).ready(() => {

        if ( this.isFlickity ) {
          // destroy Flickity
          $('.carousel-container.prod .carousel').flickity('destroy');
        }

    const $carousel = $('.carousel-container.prod .carousel').flickity({
      // options...
      cellAlign: 'left',
      contain: false,
       autoPlay: 4000,
      // freeScroll: true,
      wrapAround: true,
      pageDots: false,
      accessibility: true,
      selectedAttraction: 0.01,
      friction: 0.15,
      lazyLoad: true
    });

    // const $carousel = $('.carousel').flickity();

    const $carouselNav = $('.carousel-container.prod .carousel-nav');
    const $carouselNavCells = $carouselNav.find('.carousel-cell');
    $carouselNav.on( 'click', '.carousel-cell', function( event ) {
      const index = $( event.currentTarget ).index();
      $carousel.flickity( 'select', index );
    });

    const flkty = $carousel.data('flickity');
    const navTop  = $carouselNav.position().top;
    const navCellHeight = $carouselNavCells.height();
    const navHeight = $carouselNav.height();

    $carousel.on( 'select.flickity', function() {
      // set selected nav cell
      $carouselNav.find('.is-nav-selected').removeClass('is-nav-selected');
      // const $selected =;
        $carouselNavCells.eq( flkty.selectedIndex )
        .addClass('is-nav-selected');
      // scroll nav
      // const scrollY = $selected.position().top +
      //   $carouselNav.scrollTop() - ( navHeight + navCellHeight ) / 2;
      // $carouselNav.animate({
      //   scrollTop: scrollY
      // });
    });
        $carousel.flickity( 'select', 0 );
    // setTimeout(() => {
    //   $carousel.flickity('reloadCells');
    //   // console.log('reload slider');
    //   $carousel.flickity( 'select', 0 );
    //
    // }, 100);
      this.isFlickity = true;

    }
  );

  }
}
