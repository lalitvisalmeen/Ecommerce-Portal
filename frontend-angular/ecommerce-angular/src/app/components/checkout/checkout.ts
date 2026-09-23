import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart-item/cart';
import { CurrencyPipe } from '@angular/common';
import { HelperService } from '../../services/helper/helper-service';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {

  totalQuantity = signal<number>(0);
  totalPrice = signal<number>(0);
  
  creditCardMonths = signal<{value : number, name:string}[]>([]);
  creditCardYears = signal<number[]>([]);

  // this will be initialized later
  checkoutFormGroup!: FormGroup;

  formBuilder = inject(FormBuilder);
  cartService = inject(CartService);
  helperService = inject(HelperService);



  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: [''],
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: [''],
      }),
      paymentDetails: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expiryMonth: [{value:'', disabled:true}],
        expiryYear: [''],
      })
    });


    // get the years list to display
    this.helperService.getCreditCardYears().subscribe(
      data => this.creditCardYears.set(data)
    );

    // subscribe to the totalquantity and totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice.set(data)
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity.set(data)
    );
  }

  onSubmit() {
    console.log("Handling the submit button click");
    // if the value exists return the value otherwsie return undefined
    console.log(this.checkoutFormGroup.get("customer")?.value)
    console.log(this.checkoutFormGroup.get("customer")?.value.email)
  }

  billingAddressSameAsShipping(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      //this.checkoutFormGroup.controls['billingAddress'].disable();
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      //this.checkoutFormGroup.controls['billingAddress'].enable();
    }
  }

  handleMonthsAndYears(){
    const paymentFormGroup = this.checkoutFormGroup.get('paymentDetails');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(paymentFormGroup?.value.expiryYear);

    let startMonth : number = 1;

    if(!selectedYear){
      paymentFormGroup?.get('expiryMonth')?.disable();
    }else{
      paymentFormGroup?.get('expiryMonth')?.enable();
    }

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }

    this.helperService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths.set(data)
    );

  }

}
