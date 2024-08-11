import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductGateway } from '../../../domain/models/product/gateway/product.gateway';
import { ProductApiService } from '../../../infraestructure/driven-adapter/product/product-api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../infraestructure/config.service';


const routes: Routes = [
  // HomeComponent
  { path: '', component: ProductsComponent },
];

@NgModule({
  declarations: [
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: ProductGateway, useClass: ProductApiService },
    ConfigService,
  ],
})
export class ProductsModule { }
