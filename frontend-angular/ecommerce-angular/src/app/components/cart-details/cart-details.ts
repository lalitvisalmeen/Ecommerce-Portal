import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart-item/cart';
import { CartItem } from '../../common/cart-item/cart-items';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-cart-details',
  styleUrl: './cart-details.css',
  templateUrl: './cart-details.html',
})
export class CartDetails {
   cartItems = signal<CartItem[]>([]);
   totalQuantity = signal<number>(0);
   totalPrice = signal<number>(0);

   cartService = inject(CartService);

   ngOnInit(){
    this.listCartDetails();
   }

   listCartDetails(){
      this.cartItems.set(this.cartService.cartItems);
      // now subscribe to the service's subject variable to get the totalQuantity
      this.cartService.totalQuantity.subscribe(
        data => this.totalQuantity.set(data)
      );

      // now subscribe to the service's subject variable to get the totalPrice

      this.cartService.totalPrice.subscribe(
        data => this.totalPrice.set(data)
      );

      // compute totals 
      this.cartService.computeCartTotals();

   }

   addToCart(cartItem : CartItem){
      this.cartService.addToCart(cartItem);
   }

   decrementQuantity(cartItem: CartItem){
      this.cartService.decrementQuantity(cartItem);
      this.cartItems.set(this.cartService.cartItems);
   }

   removeItem(cartItem: CartItem){
      this.cartService.removeItem(cartItem);
      this.cartItems.set(this.cartService.cartItems);
   }

}
