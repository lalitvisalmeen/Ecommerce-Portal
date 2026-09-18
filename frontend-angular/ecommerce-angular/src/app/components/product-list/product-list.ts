import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/productservice';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list-grid.html',
})
export class ProductList implements OnInit {
  // products : Product[] = [];
  products = signal<Product[]>([]);
  categoryId: number = 1;
  categoryName: string ="";
  searchMode : boolean = false;

  // here we are using constructor injection to inject the product services
  // modern way of doing it is private productService = inject(ProductService)
  // this will map the route parameters to the route variable based on which route is acrive
  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  // once this component is initialized then this method will execute like we had postconstructor in spring boot
  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
      this.listProducts()
    );
  }

  listProducts() {
      this.searchMode = this.route.snapshot.paramMap.has("keyword");
      if(this.searchMode){
        this.searchProducts();
      }
      else{
        this.getProductList();
      }
    
  }

  getProductList(){
    // check whether the category id exists in the route.
    // the following code is checking the activatedroute in the given state(snapshot) and look for the params(parammap) with the id.
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    // if the id exists, then assign the id to the currentCategory variable
    if (hasCategoryId) {
      // use the + operator to convert the string value to number
      // use the ! in the end to tell it is not null. it is called typescript null assertion
      this.categoryId = +this.route.snapshot.paramMap.get("id")!;
      const hasCategoryName : boolean = this.route.snapshot.paramMap.has("name");
      if(hasCategoryName){
        this.categoryName = this.route.snapshot.paramMap.get("name")!;
      }
    }

    // now we have to get the products for the categoryId
    // here the subscribe will wait till it receives the data. the http call is the 
    // asynchronous function, and the observable said wait for my response
    this.productService.getProductList(this.categoryId).subscribe(data => {
      console.log('BEFORE:', this.products.length);

      this.products.set(data.content);
      console.log('AFTER:', this.products.length);
    })

  }

  searchProducts(){

    const searchValue:string  = this.route.snapshot.paramMap.get("keyword")!;

    this.productService.searchProducts(searchValue).subscribe(
      data => {
        this.products.set(data.content);
      }
    )

  }

}
