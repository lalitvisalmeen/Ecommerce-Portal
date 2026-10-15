import { Service } from '@angular/core';
import { CartItem } from '../../common/cart-item/cart-items';
import { BehaviorSubject, Subject } from 'rxjs';

@Service()
export class CartService {
    cartItems: CartItem[] = [];

    // we use behaviorsubject here, because even if other component subscribe to this event after the event is published, they will be able to get the latest update on the event.
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    storage: Storage = localStorage;
    private currentUserId: string | null = null;

    addToCart(theCartItem: CartItem) {
        // check whether the cart item already exists
        let alreadyExistInCart: boolean = false;
        let existingCartItem: CartItem | undefined;

        if (this.cartItems.length > 0) {
            // check whether the cart item already exists based on the id. If it exists then break the loop otherwise continue
            // we use array function find to loop through the cartitems, and return the element that matches the condition.
            existingCartItem = this.cartItems.find(cartItem => (cartItem.id === theCartItem.id));

            alreadyExistInCart = (existingCartItem != undefined);
        }

        if (alreadyExistInCart) {
            // increment the quantity of existing cart item
            existingCartItem!.quantity++;
        } else {
            // add it to the cartItems
            this.cartItems.push(theCartItem);
        }

        // compute cart total price and total quantity
        this.computeCartTotals();

    }

    computeCartTotals() {

        let totalPriceValue: number = 0;
        let totalQuantity: number = 0;

        for (let cartItem of this.cartItems) {
            totalPriceValue += cartItem.quantity * cartItem.unitPrice;
            totalQuantity += cartItem.quantity;
        }

        //publish the new values (the one defined with subject)
        // the subscribers to this event will receive the new value
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantity);

        //log the details(quantity, unitprice, totalprice) of the cartItems
        this.logCartDetails(totalPriceValue, totalQuantity);
        // store the cart items in session
        this.cartItemsSession();
    }

    logCartDetails(totalPriceValue: number, totalQuantity: number) {
        console.log("Contents of the cart");
        for (let cartItem of this.cartItems) {
            const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
            console.log(`name: ${cartItem.name}, quantity=${cartItem.quantity}, totalprice = ${subTotalPrice.toFixed(2)}`);
        }

        console.log(`Total price: ${totalPriceValue.toFixed(2)}, Total quantity=${totalQuantity}`);
        console.log("--------------------");
    }

    decrementQuantity(cartItem: CartItem) {

        console.log("before remove cartitems", cartItem.quantity);
        let existingCartItem: CartItem | undefined;
        if (cartItem.quantity == 1) {
            this.removeItem(cartItem);
        }
        else if (cartItem.quantity > 1) {
            existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
            if (existingCartItem) {
                existingCartItem.quantity--;
            }
            this.computeCartTotals();
        }
        console.log("after remove cartitems", existingCartItem?.quantity);

    }

    removeItem(cartItem: CartItem) {
        this.cartItems = this.cartItems.filter(item => item.id != cartItem.id);
        this.computeCartTotals();
    }

    cartItemsSession() {
        // Never save one user's cart under another user's identity. 
        if (this.currentUserId === null) {
            return;
        }
        this.storage.setItem(this.getStorageKey(), JSON.stringify(this.cartItems));
    }

    // Switch to the cart belonging to the authenticated user. 
    // Pass null when the user is logged out. 
    setUser(userId: string | null): void {
        console.log("set user is called with the user id " + userId);
        if (this.currentUserId === userId) {
            return;
        }
        this.currentUserId = userId;
        if (userId === null) {
            // Hide the previous user's cart after logout. 
            this.cartItems = [];
            this.computeCartTotals();
            return;
        }
        // Load this user's own saved cart. 
        const data = this.storage.getItem(this.getStorageKey());
        this.cartItems = data ? JSON.parse(data) : [];
        this.computeCartTotals();
    }

    private getStorageKey(): string {
        return `cartItems_${this.currentUserId}`;
    }

    clearCart(): void {
        this.cartItems = [];

        // Update the cart badge and total price immediately.
        this.totalQuantity.next(0);
        this.totalPrice.next(0);

        // Remove the saved cart for the current user.
        if (this.currentUserId !== null) {
            this.storage.removeItem(this.getStorageKey());
        }
    }
}
