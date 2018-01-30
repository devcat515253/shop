import { Injectable } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(private meta: Meta, private title: Title) { }

  setTitle(title) {
    // Sets the <title></title>
    this.title.setTitle(title);
  }

  setDescKeyw (description, keywords) {

    // Sets the <meta> tag for the page
    // <meta name="description" content="">
    // <meta name="keywords" content="">
    this.meta.addTags([
      { name: 'author', content: 'Shisha.com.ua' },
      { name: 'description', description },
      { name: 'keywords', content: keywords }
    ]);

  }
}
