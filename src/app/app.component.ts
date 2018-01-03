import { Component } from '@angular/core';
import {fadeInAnimation} from './_animations/fade-in.animation';

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
  //banerShow  = true;
}
