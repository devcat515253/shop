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
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {ProductService} from './services/product.service';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { QuickViewComponent } from './quick-view/quick-view.component';
import {CartService} from './services/cart.service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderingComponent } from './ordering/ordering.component';
import {NovaPoshtaService} from './services/nova-poshta.service';
import {OrderService} from './services/order.service';
import { AdminComponent } from './admin/admin.component';
import { AdminProdsComponent } from './admin-prods/admin-prods.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import {CommonModule} from '@angular/common';
import { AdminOrderDelailComponent } from './admin-order-delail/admin-order-delail.component';
import { AdminProdAddComponent } from './admin-prod-add/admin-prod-add.component';
import {CategoryService} from './services/category.service';
import { AdminProdUpdateComponent } from './admin-prod-update/admin-prod-update.component';
import {SeoService} from './services/seo.service';
import { PromoSliderComponent } from './promo-slider/promo-slider.component';
import { QuickviewSliderComponent } from './quickview-slider/quickview-slider.component';
import { LinkStopDirective } from './link-stop.directive';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HeaderComponent,
    CartWidgetComponent,
    ShoppingListComponent,
    FooterComponent,
    ProductDetailsComponent,
    ProductSliderComponent,
    QuickViewComponent,
    ShoppingCartComponent,
    OrderingComponent,
    AdminComponent,
    AdminProdsComponent,
    AdminOrdersComponent,
    AdminOrderDelailComponent,
    AdminProdAddComponent,
    AdminProdUpdateComponent,
    PromoSliderComponent,
    QuickviewSliderComponent,
    LinkStopDirective,
    SearchComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'shop'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    CommonModule

  ],
  providers: [
    ProductService,
    CartService,
    NovaPoshtaService,
    OrderService,
    CategoryService,
    SeoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
