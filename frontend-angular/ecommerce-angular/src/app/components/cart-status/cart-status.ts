import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart-item/cart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-cart-status',
  styleUrl: './cart-status.css',
  templateUrl: './cart-status.html',
})
export class CartStatus {
  totalPrice = signal<number>(0.00);
  totalQuantity = signal<number>(0);

  cartService = inject(CartService);

  ngOnInit() :void{
    this.updateCartTotals();
  }

  updateCartTotals(){
    // subscribe to the subject event totalQuantity
    this.cartService.totalQuantity.subscribe(
      (data) => this.totalQuantity.set(data)
    );
    // subscribe to the subject event totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice.set(data)
    )
  }


}
