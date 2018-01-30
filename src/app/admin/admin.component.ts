import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass'],
  // encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit , OnDestroy {

  constructor(@Inject(PLATFORM_ID) private platformId: string) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      $('header, footer').fadeOut(0);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
        $('header, footer').fadeIn(200);
    }
  }


}
