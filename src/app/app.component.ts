import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {fadeInAnimation} from './_animations/fade-in.animation';
import {CartService} from './services/cart.service';
import {CategoryService} from './services/category.service';
import {isPlatformBrowser} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  // // make fade in animation available to this component
  // animations: [fadeInAnimation],
  //
  // // attach the fade in animation to the host (root) element of this component
  // host: { '[@fadeInAnimation]': '' }
})
export class AppComponent {
  title = 'app';
  // banerShow  = true;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {

    // if (isPlatformBrowser(this.platformId)) {
    //   $(document).ready(() => {
    //     $('.header__baner').on('click', '.btn-close', function () {
    //       $('main').css({ paddingTop:  '-=' + $(this).height().innerHeight() }) ;
    //     });
    //   });
    // }

  }

}
