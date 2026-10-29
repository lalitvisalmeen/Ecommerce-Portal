import { Component, inject, signal } from '@angular/core';
import { Order } from '../../common/order/order';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order/order-service';
import { NotficationService } from '../../services/notification/notfication-service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-order-details',
  styleUrl: './order-details.css',
  templateUrl: './order-details.html',
})
export class OrderDetails {

  order = signal<Order | undefined>(undefined);
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  notificationService = inject(NotficationService);
  router = inject(Router);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const orderId = +params.get("id")!;
      this.getOrderDetails(orderId);
    });
  }

  getOrderDetails(orderId: number) {
    this.orderService.getOrderDetails(orderId).subscribe(
      {
        next: (data) => {
          // Success scenario
          this.order.set(data);
        },
        error: (err) => {
          // Error scenario
          const message = "There was an error in fetching the order. Please try again."
          this.notificationService.show(message, 'danger');
          this.router.navigateByUrl("/orders");
        }
      }
    )
  }

}
