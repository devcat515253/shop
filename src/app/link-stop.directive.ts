import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appLinkStop]'
})
export class LinkStopDirective {

  constructor() { }

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();

  }

}
