import { Component, signal } from '@angular/core';
import { ProductCategory } from '../../common/product-category/product-category';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '../../services/productservice';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-product-category',
  styleUrl: './product-category.css',
  templateUrl: './product-category.html',
})
export class ProductCategoryComponent {
  categories = signal<ProductCategory[]>([]);

  // do the injection of productcategoryservice
  constructor(private categoryService: ProductService) { };

  ngOnInit(): void {
    this.getCategories();
  }

  // now call the service method to get the list of categories
  getCategories() {
    this.categoryService.getCategoryList().subscribe(data => {
      this.categories.set(data);
    });
  }

}

