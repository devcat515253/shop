import {
  AfterViewInit, Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';

import {Product} from '../entity/product';
import {ProductService} from '../services/product.service';
import {isPlatformBrowser} from '@angular/common';

declare var $: any;


@Component({
  selector: 'app-quickview-slider',
  templateUrl: './quickview-slider.component.html',
  styleUrls: ['./quickview-slider.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class QuickviewSliderComponent implements OnInit, OnChanges {
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

  // ngAfterViewInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     // this.initialSlider();
  //     $(document).ready(() => {
  //       // this.initialSlider();
  //
  //       setTimeout( () => {
  //         // $('.carousel').flickity( 'select', 0 );
  //         // $('.carousel-nav').find('.carousel-cell').addClass('is-nav-selected');
  //         this.initialSlider();
  //       }, 600);
  //     });
  //   }
  // }

  getProductItem() {
    this.productService.getProductItem(this.nameProduct)
      .subscribe(
        (resp) => {
          this.products = resp;
          if (isPlatformBrowser(this.platformId)) {

            setTimeout( () => {
                      this.initialSlider();
                    }, 50);
          }

        },
        (err) => {
          console.log('Не удалось получить данные по продукту');
          console.log(err);
        });
  }


  initialSlider() {
    $(document).ready(() => {

        if ( this.isFlickity ) {
          // destroy Flickity
          $('.carousel-container.quick-view .carousel').flickity('destroy');
        }

        const $carousel = $('.carousel-container.quick-view .carousel').flickity({
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

        const $carouselNav = $('.carousel-container.quick-view .carousel-nav');
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
