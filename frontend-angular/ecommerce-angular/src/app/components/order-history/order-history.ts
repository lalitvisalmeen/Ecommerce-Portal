import { Component, inject, signal } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history/order-history-service';
import { OrderHistory } from '../../common/order-history/order-history';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-order-history',
  styleUrl: './order-history.css',
  templateUrl: './order-history.html',
})
export class OrderHistoryComponent {

  storage: Storage = sessionStorage;
  orderHistoryService = inject(OrderHistoryService);
  orders = signal<OrderHistory[]>([]);

  ngOnInit() :void{
    this.listOrders();
  }

  listOrders(){
    const email = JSON.parse(this.storage.getItem("userEmail")!);
    this.orderHistoryService.getOrderHistory(email).subscribe(
      data => {
        this.orders.set(data.content);
      }
    )

  }
}
