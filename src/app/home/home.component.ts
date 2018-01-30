import {AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {isPlatformBrowser} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit , AfterViewInit, OnDestroy {


  constructor(meta: Meta, title: Title,
              @Inject(PLATFORM_ID) private platformId: string) {

    // Sets the <title></title>
    title.setTitle('home');

    // Sets the <meta> tag for the page
    meta.addTags([
      { name: 'author', content: 'home' },
      { name: 'keywords', content: 'angular seo, angular 4 universal, etc'},
      { name: 'description', content: 'home' },
    ]);

  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      // $(document).ready(() => {
      //
      //   $('.item__info .item__details ').hover(function () {
      //     $(this).slideDown();
      //     console.log($(this));
      //   }, function () {
      //     $(this).slideUp();
      //   });
      //
      // });


    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $('header .header ').addClass('header_absolute');


      $('.image-menu .item').hover(function () {
        // if($(this).find('.item__details').is(':animated')) return;

        $(this).find('.item__details').slideDown();

        setTimeout( () => {
          $(this).find('.details').animate({opacity: 1}, 400);
        }, 400);

      }, function () {
        $(this).find('.details').animate({opacity: 0}, 400);
        $(this).find('.item__details').slideUp();

      });

      // $(document).ready(() => {
      // });
       // $('.home').removeAttr( 'style' );
    }
  }


  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      $('header .header ').removeClass('header_absolute');
    }
  }

}
