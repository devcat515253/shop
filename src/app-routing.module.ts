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
import {AdminOrderDelailComponent} from './app/admin-order-delail/admin-order-delail.component';
import {AdminProdAddComponent} from './app/admin-prod-add/admin-prod-add.component';
import {AdminProdUpdateComponent} from './app/admin-prod-update/admin-prod-update.component';
import {SearchComponent} from './app/search/search.component';
import {AdminLoginComponent} from './app/admin-login/admin-login.component';
import {AuthAdminGuard} from './app/_guards/auth-admin.guard';
import {AdminCategoriesComponent} from './app/admin-categories/admin-categories.component';
import {AdminSubcategoriesComponent} from './app/admin-subcategories/admin-subcategories.component';
import {AdminTypeProdComponent} from './app/admin-type-prod/admin-type-prod.component';
import {AdminTypeProdPropertyComponent} from './app/admin-type-prod-property/admin-type-prod-property.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'collections/:categoryUrl', component: ShoppingListComponent },
  { path: 'collections/:categoryUrl/:nameSubCategory', component: ShoppingListComponent },
  // { path: 'products', component: ProductDetailsComponent },
  { path: 'products/:nameProduct', component: ProductDetailsComponent },
  { path: 'products/:nameProduct/:idProduct', component: ProductDetailsComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'ordering', component: OrderingComponent },
  { path: 'search', component: SearchComponent },
  {  path: 'adminLogin', component: AdminLoginComponent },

  { path: 'admin', component: AdminComponent,  canActivate: [AuthAdminGuard],
    children: [
      { path: '', redirectTo: '/admin/orders', pathMatch: 'full'},
       { path: 'prods' ,  component: AdminProdsComponent},
       { path: 'prods/add' ,  component: AdminProdAddComponent},
       { path: 'prods/update/:product_id' ,  component: AdminProdUpdateComponent},
      // { path: 'prods',
      //   children: [
      //     { path: '' ,  component: AdminProdsComponent },
      //     { path: 'add' ,  component: AdminProdAddComponent }
      //   ]
      // },

      { path: 'orders', component: AdminOrdersComponent },
      { path: 'orders/:order_id', component: AdminOrderDelailComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'subCategories', component: AdminSubcategoriesComponent },
      { path: 'typeProd', component: AdminTypeProdComponent },
      { path: 'typeProdProperty', component: AdminTypeProdPropertyComponent }
    ]
  },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
