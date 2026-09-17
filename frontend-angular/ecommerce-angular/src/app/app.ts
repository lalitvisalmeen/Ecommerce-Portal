import { Component, signal } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { ProductCategoryComponent } from './components/product-category/product-category';
import { SearchProduct } from './components/search-product/search-product';

@Component({
  imports: [RouterOutlet, ProductCategoryComponent, SearchProduct ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ecommerce-angular');
}
