import { Address } from "../address/address";
import { OrderItem } from "../order-item/order-item";

export class Order {
    status?: string;
    orderTrackingNumber?: string;
    orderItems?: OrderItem[];
    billingAddress?: Address;
    shippingAddress?: Address;
    createdDate?: Date;

    constructor(public totalPrice: number, public totalQuantity: number) { }
}
