import { Component, signal } from '@angular/core';
import { Product } from '../../../common/product';
import { ProductService } from '../../../services/productservice';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  product = signal<Product | undefined>(undefined); // It tells typescipt, dont give me an error, i will assign a value later

  constructor(private productService : ProductService, private route:ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      const productId = +params.get("id")!;
      this.getProductDetails(productId)});
    }

  getProductDetails(productId : number){
    // call the productservice function to get the details and store to the variable
    this.productService.getProductDetails(productId).subscribe(
      data => {
        this.product.set(data);
      }
    );
  }
}
