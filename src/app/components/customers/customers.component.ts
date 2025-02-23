import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

import { Customer } from '../../interfaces/customer.model';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { Product } from '../../interfaces/product.model';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit, OnDestroy {
  products!: Product[] | null;
  productSub!: Subscription;
  isUploadingCustomer = false;

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService,
    private customerService: CustomersService
  ) {}

  ngOnInit(): void {
    if (!this.products || this.products?.length === 0) {
      this.productService.fetchProducts();
    }

    this.productSub = this.productService.products$.subscribe((products) => {
      this.products = products;
      console.log('this.products: ', this.products);
    });
  }

  openCustomerDialog(customer: Customer | null) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      disableClose: true,
      data: {
        customer: customer,
        products: this.products,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.event === 'create') {
        await this.createCustomer(result);
      } else if (result.event === 'update') {
        await this.updateCustomer(result);
      }
    });
  }

  async createCustomer(result: any) {
    this.isUploadingCustomer = true;
    await this.customerService.createCustomer(result.data.formValue);
    this.isUploadingCustomer = false;
  }

  async updateCustomer(result: any) {
    this.isUploadingCustomer = true;
    await this.customerService.updateCustomer(result.data.formValue);
    this.isUploadingCustomer = false;
  }

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }
}
