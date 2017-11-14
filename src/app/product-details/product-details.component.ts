import {AfterViewInit, Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {isPlatformBrowser} from '@angular/common';
declare var $: any;
// import * as $ from 'jquery';





@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.sass']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  testBrowser: boolean;
  private id: number;
  selected = '';

  options = [
    {
      value: 'Red',
      label: 'Red'
    },
    {
      value: 'Black',
      label: 'Black'
    },
    {
      value: 'Blue',
      label: 'Blue'
    },
    {
      value: 'Green',
      label: 'Green'
    },
    {
      value: 'GOLDFISH',
      label: 'Goldfish'
    }
  ];

  constructor(private activateRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: string) {
    // this.testBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => this.id = params['id']);
    console.log(this.id);
    console.log(this.selected);

  }

  ngAfterViewInit() {
   // if(this.testBrowser) {
    if (isPlatformBrowser(this.platformId)) {
      // import('flickity');
      // $(document).on('ready', function () {
      //   $('.main-carousel').flickity({
      //     // options
      //     cellAlign: 'left',
      //     contain: true,
      //     autoPlay: 10000,
      //     freeScroll: true,
      //     wrapAround: true,
      //   });
      // });

      $(document).ready(function() {

      //   $('.gallery-main').flickity({
      //   // options
      //   cellAlign: 'left',
      //   contain: true,
      //   // autoPlay: 3000,
      //   freeScroll: true,
      //   wrapAround: true,
      //   pageDots: false
      // });

        // $('.product-details__content').click(function() {
        //   $(this).hide();
        // });

        const $carousel = $('.carousel').flickity({
          // options...
          cellAlign: 'left',
          contain: false,
          // autoPlay: 3000,
          // freeScroll: true,
          wrapAround: true,
          pageDots: false,
          accessibility: true,
          selectedAttraction: 0.01,
          friction: 0.15,
          // arrowShape: 'M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z'
        });

        // external js: flickity.pkgd.js

        // const $carousel = $('.carousel').flickity();

        const $carouselNav = $('.carousel-nav');
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
          const $selected = $carouselNavCells.eq( flkty.selectedIndex )
            .addClass('is-nav-selected');
          // scroll nav
          // const scrollY = $selected.position().top +
          //   $carouselNav.scrollTop() - ( navHeight + navCellHeight ) / 2;
          // $carouselNav.animate({
          //   scrollTop: scrollY
          // });
        });




        $().fancybox({
          selector : '[data-fancybox="galleryimg"]',
          loop     : true,
          protect: true
        });

      });

    }
  }

  selectChange() {
    console.log(this.selected);
  }

}
