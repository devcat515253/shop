import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import {AppRoutingModule} from '../app-routing.module';
import { HeaderComponent } from './header/header.component';
import { CartWidgetComponent } from './cart-widget/cart-widget.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { FooterComponent } from './footer/footer.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HeaderComponent,
    CartWidgetComponent,
    ShoppingListComponent,
    FooterComponent,
    ProductDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'shop'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
