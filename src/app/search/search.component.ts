import {Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {Product} from '../entity/product';
import {isPlatformBrowser} from '@angular/common';
import {ProductService} from '../services/product.service';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  searchString: string;

  products: Product[];

  searchResult: Product[];


  quickNameProduct: string;

  constructor(private productService: ProductService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit() {
    this.getProds();
    this.scrollToTop();
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(function () {
        $('html, body').animate({scrollTop: 0}, 500);
      });
    }
  }


  getProds() {
    this.productService.getProdsForMainSearch()
      .subscribe(
        (resp) => {
          this.products = resp;
        },
        (err) => {
          console.log('Не удалось получить данные для основного поиска');
          console.log(err);
        });
  }


  searchById() {
    this.searchResult = this.products.filter(el => el.product_id.toString().indexOf(this.searchString) >= 0   );

    if (this.searchResult.length == 0) {
      this.searchByName();
    }
    else {
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.initialMagnific();
        }
      }, 50);
    }
  }

  searchByName() {
    this.searchResult = this.products.filter(el => el.product_name.toString().toLowerCase().indexOf(this.searchString.toLowerCase()) >= 0 );

    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.initialMagnific();
      }
    }, 50);
  }


  search() {
    console.log(this.searchString);
    this.searchById();
  }



  overlayClick(event, nameProd) {
    event.preventDefault();
    // event.stopPropagation();
    // console.log(event.target.classList.contains('btn-white'));

    if (event.target.classList.contains('btn-white')) {
      return false;
    }

    this.router.navigate(['/products', nameProd]);

  }

  showShortInfo(product_name: string) {
    this.quickNameProduct = product_name;
    if (isPlatformBrowser(this.platformId)) {
      //$('body').css({marginRight: this.scrollbarWidth() + 'px' });
      //$('body').addClass('blockScroll');


    }
    // console.log(product_name);
  }

  scrollbarWidth() {
    let documentWidth = +document.documentElement.clientWidth;
    let windowsWidth = +window.innerWidth;
    let scrollbarWidth = windowsWidth - documentWidth;
    return scrollbarWidth;
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
          if ( $(window).width() < 768 ) {
            return false;
          }
          return true;
        },
        callbacks: {
          beforeOpen: () => { $('body').css({marginRight: this.scrollbarWidth() + 'px' });  $('body').addClass('blockScroll'); },
          // close: () => {  $('body').css({marginRight: this.scrollbarWidth() + 'px' }); $('body').removeClass('blockScroll'); }
          close: () => {  $('body').removeAttr( 'style' ); $('body').removeClass('blockScroll'); }
        }
      });


    });

  }

}
