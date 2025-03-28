import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Customer } from '../../interfaces/customer.model';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
// import { Product } from '../../interfaces/product.model';
// import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { CustomersService } from '../../customers.service';
import { SaleProgressComponent } from '../sales-progress/sales-progress.component';
import { MatSort } from '@angular/material/sort';
import { UIService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { DocUser } from '../../interfaces/user.model';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    // components
    SaleProgressComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit, OnDestroy {
  // products!: Product[] | null;
  // productSub!: Subscription;
  customers: Customer[] | null = [];
  customersSub!: Subscription;
  isUploadingCustomer = false;
  isLoading = true;
  private loadingSub!: Subscription;

  // table variables
  displayedColumns: string[] = [
    'name',
    'company',
    'country',
    'foundFrom',
    'product',
    'productQuantity',
    'salesProgress',
    'createdBy',
    'createdDate',
    'edit',
    'shipGoods',
  ];
  dataSource!: MatTableDataSource<Customer>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    // private productService: ProductsService,
    private customerService: CustomersService,
    public authService: AuthService,
    private uiService: UIService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );

    this.customersSub = this.customerService.customers$.subscribe(
      (customers) => {
        if (customers) {
          this.customers = customers
            .filter((cust) => {
              // console.log('cust.createdBy: ', cust.createdBy);
              // console.log('this.authService.docUser: ', this.authService.docUser);
              return cust.createdBy?.uid === this.authService.docUser?.uid;
            })
            .sort((a: Customer, b: Customer) => {
              return b.createdDate.toDate() - a.createdDate.toDate();
            });
          this.dataSource = new MatTableDataSource(this.customers);

          if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
      }
    );

    // this.productSub = this.productService.products$.subscribe((products) => {
    //   this.products = products;
    //   console.log('this.products: ', this.products);
    // });

    this.fetchCustomers();
    // this.fetchProducts();
  }

  // fetchProducts() {
  //   if (!this.products || this.products?.length === 0) {
  //     this.productService.fetchProducts();
  //   }
  // }

  fetchCustomers() {
    if (!this.customers || this.customers?.length === 0) {
      this.customerService.fetchCustomers();
    }
  }

  // getProductModelNumber(item: { product: Product; quantity: number }) {
  //   return this.products?.find((product) => product.id === item.product.id)
  //     ?.modelNumber;
  // }

  openCustomerDialog(customer: Customer | null) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      disableClose: true,
      data: {
        customer: customer,
        // products: this.products,
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
    await this.customerService.createCustomer(
      result.data.formValue,
      this.authService.docUser as DocUser
    );
    this.isUploadingCustomer = false;
  }

  async updateCustomer(result: any) {
    this.isUploadingCustomer = true;
    await this.customerService.updateCustomer(
      result.data.originalCustomer,
      result.data.formValue
    );
    this.isUploadingCustomer = false;
  }

  shipGoods(customer: Customer) {}

  ngOnDestroy(): void {
    // if (this.productSub) {
    //   this.productSub.unsubscribe();
    // }

    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
