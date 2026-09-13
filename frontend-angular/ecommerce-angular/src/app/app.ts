import { Component, signal } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { ProductCategoryComponent } from './components/product-category/product-category';

@Component({
  imports: [RouterOutlet, ProductCategoryComponent ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ecommerce-angular');
}
