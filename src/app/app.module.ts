import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ProductsModule } from './ui/pages/products/products.module';
import { NotFoundComponent } from './ui/pages/not-found/not-found.component';
import { SharedModule } from './ui/shared/shared.module';

const routes: Routes = [
  // HomeComponent
  { path: '', loadChildren: () => import('./ui/pages/products/products.module').then(m => m.ProductsModule) },

  // NotFoundComponent
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ProductsModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
