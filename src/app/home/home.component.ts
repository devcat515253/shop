import { Component, OnInit } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(meta: Meta, title: Title) {

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
  }

}
