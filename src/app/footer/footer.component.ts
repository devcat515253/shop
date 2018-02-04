import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit , AfterViewInit{

  constructor(@Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(() => {
        this.resize();

        $('.footer-wr .title').on('click', function () {

          if (window.matchMedia('(max-width: 767px)').matches) {
            $(this).closest('.column').find('nav').slideToggle();
          }


        });
      });


    }
  }

  footerNav() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      $('.footer-wr .column nav').removeAttr( 'style' );

    }
  }

  resize() {

    window.addEventListener('orientationchange',  () => {
      this.footerNav();
    }, false);


    $(window).resize( () => {
      this.footerNav();
    });



  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
        $('html, body').animate({scrollTop: 0}, 500);
    }
  }


}
