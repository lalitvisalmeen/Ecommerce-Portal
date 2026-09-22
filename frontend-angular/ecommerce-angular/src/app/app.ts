import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { ProductCategoryComponent } from './components/product-category/product-category';
import { SearchProduct } from './components/search-product/search-product';
import { CartStatus } from './components/cart-status/cart-status';

@Component({
  imports: [RouterOutlet, ProductCategoryComponent, SearchProduct, CartStatus, RouterLinkWithHref],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ecommerce-angular');
}
