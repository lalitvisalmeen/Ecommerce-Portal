import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-search-product',
  styleUrl: './search-product.css',
  templateUrl: './search-product.html',
})
export class SearchProduct {
  constructor(private router: Router){};

  doSearch(searchInput : string){
    console.log(`Search value = ${searchInput}`);
    this.router.navigateByUrl(`/search/${searchInput}`);
  }
}
