import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/productservice';

@Component({
  imports: [CommonModule],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list-table.html',
})
export class ProductList implements OnInit{
  // products : Product[] = [];
  products = signal<Product[]>([]);

  // here we are using constructor injection to inject the product services
  // modern way of doing it is private productService = inject(ProductService)
  constructor(private productService : ProductService){}

  // once this component is initialized then this method will execute like we had postconstructor in spring boot
  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(){
    // here the subscribe will wait till it receives the data. the http call is the 
    // asynchronous function, and the observable said wait for my response
    this.productService.getProductList().subscribe(data => {
      console.log('BEFORE:', this.products.length);

      this.products.set(data);
      console.log('AFTER:', this.products.length);
    })
  }

}
