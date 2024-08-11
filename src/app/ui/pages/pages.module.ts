import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ProductGateway } from '../../domain/models/product/gateway/product.gateway';
import { ProductApiService } from '../../infraestructure/driven-adapter/product/product-api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../infraestructure/config.service';
import { AddProductComponent } from './add-product/add-product.component';


const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'add', component: AddProductComponent },
];

@NgModule({
  declarations: [
    ProductsComponent,
    AddProductComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    { provide: ProductGateway, useClass: ProductApiService },
    ConfigService,
  ],
})
export class PagesModule { }
