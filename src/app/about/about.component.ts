import { Component, OnInit } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {

  constructor(meta: Meta, title: Title) {
    // Sets the <title></title>
    title.setTitle('about');

    // Sets the <meta> tag for the page
    meta.addTags([
      { name: 'author', content: 'about' },
      { name: 'keywords', content: 'angular seo, angular 4 universal, etc'},
      { name: 'description', content: 'about' },
    ]);
  }

  ngOnInit() {
  }

}
