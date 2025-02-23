import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

import { getCountries } from 'node-countries';

import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { SaleProgressComponent } from '../sales-progress/sales-progress.component';

import { MyErrorStateMatcher } from '../../services/utils.service';
import { MEDIA_PLATFORMS } from '../../constants/excel';
import {
  Customer,
  MediaPlatform,
  SalesProgress,
} from '../../interfaces/customer.model';
import { Product } from '../../interfaces/product.model';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    // components
    SaleProgressComponent,
  ],
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.scss',
})
export class CustomerDialogComponent implements OnInit, OnDestroy {
  customerForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  platforms = MEDIA_PLATFORMS.sort();
  countries = getCountries()
    .map((country) => country.name)
    .sort();

  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { customer: Customer; products: Product[] },
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      // createdBy: [
      //   this.data.customer
      //     ? this.data.customer?.createdBy
      //     : this.authService.authUser?.uid,
      // ],
      name: [this.data.customer?.name || '', [Validators.required]],
      company: [this.data.customer?.company || ''],
      country: [this.data.customer?.country || ''],
      companyWebsite: [this.data.customer?.companyWebsite || ''],
      foundFrom: [this.data.customer?.foundFrom || ''],
      contacts: this.fb.array([]),
      products: this.fb.array([]),
      salesProgress: this.data.customer?.salesProgress || '',
    });
  }
  // ----------------------------------    emails, companies, contact numbers    ---------------------------------- //
  formArr(arrName: string) {
    return this.customerForm.controls[arrName] as FormArray;
  }

  createArrItem(arrName: string) {
    const validatorsArr = [Validators.required];
    if (arrName === 'emails') {
      validatorsArr.push(Validators.email);
    }
    const fc = new FormControl('', validatorsArr);
    (this.customerForm.get(arrName) as FormArray)?.push(fc);
  }

  removeArrItem(arrName: string, index: number) {
    console.log(index);
    const arr = this.customerForm.get(arrName) as FormArray;
    console.log(arr);

    if (arr.length > 1) {
      arr.removeAt(index);
    } else {
      arr.clear();
    }
  }

  // ----------------------------------    contacts    ---------------------------------- //
  createContact() {
    this.pushContactControlToArr('', '');
  }

  pushContactControlToArr(mediaPlatform: MediaPlatform | string, link: string) {
    const contactFg = this.fb.group({
      mediaPlatform: [mediaPlatform, Validators.required],
      link: [link, Validators.required],
    });

    (this.customerForm.get('contacts') as FormArray)?.push(contactFg);
    // console.log('contactFg: ', contactFg);
    // console.log(
    //   "this.customerForm.get('contacts'): ",
    //   this.customerForm.get('contacts')
    // );
  }

  // ----------------------------------    products    ---------------------------------- //
  createProduct() {
    this.pushProductControlToArr(null, 0);
  }

  pushProductControlToArr(product: Product | null, quantity: number) {
    const productFg = this.fb.group({
      product: [product, Validators.required],
      quantity: [quantity, Validators.required],
    });

    (this.customerForm.get('products') as FormArray)?.push(productFg);
    // console.log('productFg: ', productFg);
    // console.log(
    //   "this.customerForm.get('products'): ",
    //   this.customerForm.get('products')
    // );
  }

  // ----------------------------------    Sales Progress    ---------------------------------- //
  onSalesProgressSet(salesProgress: SalesProgress) {
    this.customerForm.get('salesProgress')?.setValue(salesProgress);
    console.log('this.customerForm.value: ', this.customerForm.value);
  }

  // ----------------------------------    submit    ---------------------------------- //

  // test() {
  //   console.log(this.customerForm.value);
  // }

  onSubmit() {
    // console.log('this.fileUpload: ');
    // console.log(this.fileUpload);

    this.dialogRef.close({
      event: this.data.customer ? 'update' : 'create',
      data: {
        originalCustomer: this.data.customer,
        formValue: this.customerForm.value,
      },
    });
  }

  ngOnDestroy() {}
}
