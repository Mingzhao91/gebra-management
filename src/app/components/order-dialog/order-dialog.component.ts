import {
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

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
import {
  provideNativeDateAdapter,
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MyErrorStateMatcher } from '../../services/utils.service';

import {
  Customer,
  MediaPlatform,
  MediaPlatformLink,
  SalesProgress,
} from '../../interfaces/customer.model';
import { Order } from '../../interfaces/order.model';

@Component({
  selector: 'app-order-dialog',
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
    MatDatepickerModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'zh-cn' },
  ],
  templateUrl: './order-dialog.component.html',
  styleUrl: './order-dialog.component.scss',
})
export class OrderDialogComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  // private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));

  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { order: Order; customers: Customer[] },
    private fb: FormBuilder
  ) {
    // console.log(this._locale());
  }

  ngOnInit(): void {
    // 'customer',
    // 'orderSerialNumber', // 订单序列号
    // 'productModel', // 产品型号
    // 'quantity',
    // 'price',
    // 'total',
    // 'packagingRequirements', // 包装要求
    // 'bareMachineRequirements', // 裸机要求
    // 'cartonRequirements', // 装箱要求
    // 'plannedShippingDate', // 计划发货日期
    // 'actualShippingDate', // 实际发货日期
    // 'shippingChannel', // 运输渠道
    // 'internationalLogistics', // 国际物流
    // 'collectedShippingFee', // 收取运费
    // 'actualShippingFee', // 实际运费
    // 'notes', // 备注

    this.orderForm = this.fb.group({
      customer: [this.data.order?.customer || null, [Validators.required]],
      products: this.fb.array([]),
      total: [this.data.order?.total || 0],
      packagingRequirements: [this.data.order?.packagingRequirements || ''],
      bareMachineRequirements: [this.data.order?.bareMachineRequirements || ''],
      cartonRequirements: [this.data.order?.cartonRequirements || ''],
      plannedShippingDate: [
        (this.data.order?.plannedShippingDate as any)?.toDate() || null,
      ],
      actualShippingDate: [
        (this.data.order?.actualShippingDate as any)?.toDate() || null,
      ],
      shippingChannel: [this.data.order?.shippingChannel || ''],
      internationalLogistics: [this.data.order?.internationalLogistics || ''],
      collectedShippingFee: [this.data.order?.collectedShippingFee || 0],
      actualShippingFee: [this.data.order?.actualShippingFee || 0],
      notes: [this.data.order?.notes || ''],
    });

    this.setCustomer();
    this.setProductsFormArray();
  }

  setCustomer() {
    if (this.data.order?.customer) {
      if (this.data.customers) {
        const customerFound = this.data.customers.find(
          (cust) => cust.id === this.data.order?.customer.id
        );

        this.orderForm.get('customer')?.setValue(customerFound);
      }
    }
  }

  setProductsFormArray() {
    if (this.data.order?.products?.length > 0) {
      const products = this.data.order.products;

      if (products?.length > 0) {
        products.forEach((obj) => {
          const productFg = this.fb.group({
            quantity: [obj.quantity, Validators.required],
            productModel: [obj.productModel, Validators.required],
            price: [obj.price, Validators.required],
          });
          (this.orderForm.get('products') as FormArray)?.push(productFg);
        });
      }
    }
  }

  // ----------------------------------    array    ---------------------------------- //
  formArr(arrName: string) {
    return this.orderForm.controls[arrName] as FormArray;
  }

  // createArrItem(arrName: string) {
  //   const validatorsArr = [Validators.required];
  //   if (arrName === 'emails') {
  //     validatorsArr.push(Validators.email);
  //   }
  //   const fc = new FormControl('', validatorsArr);
  //   (this.orderForm.get(arrName) as FormArray)?.push(fc);
  // }

  removeArrItem(arrName: string, index: number) {
    console.log(index);
    const arr = this.orderForm.get(arrName) as FormArray;
    console.log(arr);

    if (arr.length > 1) {
      arr.removeAt(index);
    } else {
      arr.clear();
    }
  }

  // ----------------------------------    products    ---------------------------------- //
  createProduct() {
    this.pushProductControlToArr('', 0, 0);
  }

  pushProductControlToArr(
    productModel: string,
    quantity: number,
    price: number
  ) {
    const productFg = this.fb.group({
      productModel: [productModel, Validators.required],
      quantity: [quantity, Validators.required],
      price: [price, Validators.required],
    });

    (this.orderForm.get('products') as FormArray)?.push(productFg);
    // console.log('productFg: ', productFg);
    // console.log(
    //   "this.orderForm.get('products'): ",
    //   this.orderForm.get('products')
    // );
  }

  updateTotal() {
    let total = 0;

    (this.orderForm.get('products') as FormArray).controls.forEach((ctrl) => {
      const quantity = ctrl?.get('quantity')?.value;
      const price = ctrl?.get('price')?.value;

      // console.log('quantity: ', ctrl.get('quantity'));
      // console.log('price', ctrl.get('price'));

      total += quantity > 0 && price > 0 ? quantity * price : 0;
    });

    // console.log('total: ', total);

    this.orderForm.get('total')?.setValue(total);
  }

  test() {
    console.log(this.orderForm.value);
  }

  onSubmit() {
    // console.log('this.fileUpload: ');
    // console.log(this.fileUpload);

    this.dialogRef.close({
      event: this.data.order ? 'update' : 'create',
      data: {
        originalOrder: this.data.order,
        formValue: this.orderForm.value,
      },
    });
  }

  ngOnDestroy(): void {}
}
