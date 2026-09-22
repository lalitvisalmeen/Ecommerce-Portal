import { Service } from '@angular/core';
import { CartItem } from '../../common/cart-item/cart-items';
import { Subject } from 'rxjs';

@Service()
export class CartService {
    cartItems : CartItem[] = [];

    totalQuantity: Subject<number> = new Subject<number>();
    totalPrice : Subject<number> = new Subject<number>();

    addToCart(theCartItem : CartItem){
        // check whether the cart item already exists
        let alreadyExistInCart: boolean = false;
        let existingCartItem : CartItem | undefined;

        if(this.cartItems.length > 0 ){
            // check whether the cart item already exists based on the id. If it exists then break the loop otherwise continue
            // we use array function find to loop through the cartitems, and return the element that matches the condition.
            existingCartItem = this.cartItems.find(cartItem => (cartItem.id === theCartItem.id));

            alreadyExistInCart = (existingCartItem != undefined);
        }

        if(alreadyExistInCart){
            // increment the quantity of existing cart item
            existingCartItem!.quantity++;
        }else{
            // add it to the cartItems
            this.cartItems.push(theCartItem);
        }

        // compute cart total price and total quantity
        this.computeCartTotals();

    }

    computeCartTotals(){

        let totalPriceValue: number = 0;
        let totalQuantity: number = 0;

        for(let cartItem of this.cartItems){
            totalPriceValue += cartItem.quantity * cartItem.unitPrice;
            totalQuantity += cartItem.quantity;
        }

        //publish the new values (the one defined with subject)
        // the subscribers to this event will receive the new value
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantity);

        //log the details(quantity, unitprice, totalprice) of the cartItems
        this.logCartDetails(totalPriceValue, totalQuantity);

    }

    logCartDetails(totalPriceValue : number, totalQuantity : number){
        console.log("Contents of the cart");
        for(let cartItem of this.cartItems){
            const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
            console.log(`name: ${cartItem.name}, quantity=${cartItem.quantity}, totalprice = ${subTotalPrice.toFixed(2)}`);
        }

        console.log(`Total price: ${totalPriceValue.toFixed(2)}, Total quantity=${totalQuantity}`);
        console.log("--------------------");
    }

    decrementQuantity(cartItem : CartItem){

       console.log("before remove cartitems", cartItem.quantity);
       let existingCartItem: CartItem | undefined;
       if(cartItem.quantity == 1){
            this.removeItem(cartItem);
       }
       else if(cartItem.quantity > 1){
            existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
            if(existingCartItem){
                existingCartItem.quantity--;
            }
            this.computeCartTotals();
        }
        console.log("after remove cartitems", existingCartItem?.quantity);
        
    }

    removeItem(cartItem : CartItem){
        this.cartItems = this.cartItems.filter(item => item.id != cartItem.id);
        this.computeCartTotals();
    }
}
