import { Address } from "../address/address";
import { Customer } from "../customer/customer";
import { OrderItem } from "../order-item/order-item";
import { Order } from "../order/order";

export class Purchase {

    customer: Customer | null = null;
    shippingAddress: Address | null = null;
    billingAddress: Address | null = null;
    order: Order | null = null;
    orderItems: OrderItem[] = [];

}
