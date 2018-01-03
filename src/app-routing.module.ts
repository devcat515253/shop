import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomeComponent} from './app/home/home.component';
import {AboutComponent} from './app/about/about.component';
import {ShoppingListComponent} from './app/shopping-list/shopping-list.component';
import {ProductDetailsComponent} from './app/product-details/product-details.component';
import {ShoppingCartComponent} from './app/shopping-cart/shopping-cart.component';
import {OrderingComponent} from './app/ordering/ordering.component';
import {AdminComponent} from './app/admin/admin.component';
import {AdminOrdersComponent} from './app/admin-orders/admin-orders.component';
import {AdminProdsComponent} from './app/admin-prods/admin-prods.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'collections/:categoryUrl', component: ShoppingListComponent },
  { path: 'collections/:categoryUrl/:nameSubCategory', component: ShoppingListComponent },
  { path: 'products', component: ProductDetailsComponent },
  { path: 'products/:nameProduct', component: ProductDetailsComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'ordering', component: OrderingComponent },
  { path: 'admin', component: AdminComponent,
    children: [
      { path: '', component: AdminOrdersComponent },
      { path: 'prods', component: AdminProdsComponent },
    ]
  },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
