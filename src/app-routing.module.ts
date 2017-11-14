import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomeComponent} from './app/home/home.component';
import {AboutComponent} from './app/about/about.component';
import {ShoppingListComponent} from './app/shopping-list/shopping-list.component';
import {ProductDetailsComponent} from './app/product-details/product-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
  ,
  {
    path: 'collections',
    component: ShoppingListComponent
  }
  ,
  {
    path: 'products',
    component: ProductDetailsComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent
  },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
