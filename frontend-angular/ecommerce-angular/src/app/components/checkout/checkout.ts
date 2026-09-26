import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart-item/cart';
import { CurrencyPipe } from '@angular/common';
import { HelperService } from '../../services/helper/helper-service';
import { Country } from '../../common/country/country';
import { State } from '../../common/state/state';
import { CustomValidator } from '../../validators/custom-validator';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {

  totalQuantity = signal<number>(0);
  totalPrice = signal<number>(0);

  creditCardMonths = signal<{ value: number, name: string }[]>([]);
  creditCardYears = signal<number[]>([]);

  // this will be initialized later
  checkoutFormGroup!: FormGroup;

  formBuilder = inject(FormBuilder);
  cartService = inject(CartService);
  helperService = inject(HelperService);

  // get country and state list
  countries = signal<Country[]>([]);

  // state for shipping
  shippingStates = signal<State[]>([]);
  // state list for billing
  billingStates = signal<State[]>([]);



  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, CustomValidator.minLengthAfterTrim(2), CustomValidator.whiteSpace]],
        lastName: ['', [Validators.required, CustomValidator.minLengthAfterTrim(2), CustomValidator.whiteSpace]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      }),
      shippingAddress: this.formBuilder.group({
        country: ['', [Validators.required]],
        street: ['', [Validators.required, CustomValidator.minLengthAfterTrim(2), CustomValidator.whiteSpace]],
        city: ['', [Validators.required, CustomValidator.minLengthAfterTrim(2), CustomValidator.whiteSpace]],
        state: ['', [Validators.required]],
        zipcode: ['', [Validators.required, CustomValidator.minLengthAfterTrim(5), CustomValidator.whiteSpace]],
      }),
      billingAddress: this.formBuilder.group({
        country: ['', [Validators.required]],
        street: ['', [Validators.required, CustomValidator.minLengthAfterTrim(2), CustomValidator.whiteSpace]],
        city: ['', [Validators.required, CustomValidator.minLengthAfterTrim(2), CustomValidator.whiteSpace]],
        state: ['', [Validators.required]],
        zipcode: ['', [Validators.required, CustomValidator.minLengthAfterTrim(5), CustomValidator.whiteSpace]],
      }),
      paymentDetails: this.formBuilder.group({
        cardType: ['', [Validators.required]],
        nameOnCard: ['', [Validators.required, CustomValidator.minLengthAfterTrim(2), CustomValidator.whiteSpace]],
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}(\s?\d{4}){3}$/)]],
        securityCode: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
        expiryMonth: [{ value: '', disabled: true }, [Validators.required]],
        expiryYear: ['', [Validators.required]],
      })
    });


    // get the years list to display
    this.helperService.getCreditCardYears().subscribe(
      data => this.creditCardYears.set(data)
    );

    // subscribe to the totalquantity and totalPrice
    this.reviewCartDetails();

    // get the country list
    this.helperService.getCountryList().subscribe(
      data => this.countries.set(data)
    );
  }

  // use the getters to use in the form to access form controls
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  // use the getters for the shipping details to access form controls
  get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingZipcode() { return this.checkoutFormGroup.get('shippingAddress.zipcode'); }

  // use the getters to access form controls of billing address
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingZipcode() { return this.checkoutFormGroup.get('billingAddress.zipcode'); }

  // use the getters to access form controls of payment details
  get cardType() { return this.checkoutFormGroup.get('paymentDetails.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('paymentDetails.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('paymentDetails.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('paymentDetails.securityCode'); }
  get expiryMonth() { return this.checkoutFormGroup.get('paymentDetails.expiryMonth'); }
  get expiryYear() { return this.checkoutFormGroup.get('paymentDetails.expiryYear'); }

  onSubmit() {
    console.log("Handling the submit button click");
    // check the validation errors
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    // if the value exists return the value otherwsie return undefined
    console.log(this.checkoutFormGroup.get("customer")?.value)
    console.log(this.checkoutFormGroup.get("customer")?.value.email)
  }

  billingAddressSameAsShipping(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingStates.set(this.shippingStates());
      this.checkoutFormGroup.get('billingAddress')?.disable();
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.checkoutFormGroup.get(`billingAddress.state`)?.setValue('');
      this.checkoutFormGroup.get(`billingAddress.country`)?.setValue('');
      this.billingStates.set([]);
      this.checkoutFormGroup.controls['billingAddress']?.enable();

    }
  }

  handleMonthsAndYears() {
    const paymentFormGroup = this.checkoutFormGroup.get('paymentDetails');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(paymentFormGroup?.value.expiryYear);

    let startMonth: number = 1;

    if (!selectedYear) {
      paymentFormGroup?.get('expiryMonth')?.disable();
    } else {
      paymentFormGroup?.get('expiryMonth')?.enable();
    }

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.helperService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths.set(data)
    );

  }

  getStates(type: 'shipping' | 'billing') {

    let countryCode: string;

    if (type == "shipping") {
      countryCode = this.checkoutFormGroup.get('shippingAddress')?.value.country.code;
    } else {
      countryCode = this.checkoutFormGroup.get('billingAddress')?.value.country.code;
    }

    console.log('country code ' + countryCode);

    if (countryCode) {
      this.helperService.getStatesList(countryCode).subscribe(
        data => {
          if (type == "shipping") {
            this.shippingStates.set(data)
          } else {
            this.billingStates.set(data)
          }
        }
      );

    } else {
      this.checkoutFormGroup.get(`${type}Address.state`)?.setValue('');
      if (type == "shipping") {
        this.shippingStates.set([]);
      } else {
        this.billingStates.set([]);
      }
    }
  }

  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice.set(data)
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity.set(data)
    );
  }
}
