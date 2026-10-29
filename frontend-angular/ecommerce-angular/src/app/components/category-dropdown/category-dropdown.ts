import { Component, HostListener, signal, ElementRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductCategory } from '../../common/product-category/product-category';
import { ProductService } from '../../services/productservice';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-category-dropdown',
  styleUrl: './category-dropdown.css',
  templateUrl: './category-dropdown.html',
})
export class CategoryDropdown {

  categories = signal<ProductCategory[]>([]);
  elementRef = inject(ElementRef)

  // do the injection of productcategoryservice
  constructor(private categoryService: ProductService) { };

  ngOnInit(): void {
    this.getCategories();
  }
  isDropdownOpen = false;

  // Keep your existing categories signal and category-loading logic here.

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // now call the service method to get the list of categories
  getCategories() {
    this.categoryService.getCategoryList().subscribe(data => {
      this.categories.set(data);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(
      event.target
    );

    if (!clickedInside) {
      this.closeDropdown();
    }
  }
}
