import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { ProductCategoryComponent } from './components/product-category/product-category';
import { SearchProduct } from './components/search-product/search-product';
import { CartStatus } from './components/cart-status/cart-status';
import { LoginStatus } from './components/login-status/login-status';

@Component({
  imports: [RouterOutlet, ProductCategoryComponent, SearchProduct, CartStatus, RouterLinkWithHref, LoginStatus],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ecommerce-angular');
  accountMenuOpen = false;
  accountEmail = '';

  onAccountMenuChange(event: {
    open: boolean;
    email: string | null;
  }) {

    this.accountMenuOpen = event.open;
    this.accountEmail = event.email ?? '';

  }
}
