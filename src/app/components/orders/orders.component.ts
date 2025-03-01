import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';

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
import { Subscription } from 'rxjs';
import { CustomersService } from '../../customers.service';
import { SaleProgressComponent } from '../sales-progress/sales-progress.component';
import { MatSort } from '@angular/material/sort';
import { UIService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { DocUser } from '../../interfaces/user.model';
import { Order } from '../../interfaces/order.model';
import { OrdersService } from '../../services/orders.service';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    DecimalPipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] | null = [];
  ordersSub!: Subscription;
  customers: Customer[] | null = [];
  customersSub!: Subscription;
  isUploadingOrders = false;
  isLoading = true;
  private loadingSub!: Subscription;

  // table variables
  displayedColumns: string[] = [
    'customer',
    'orderSerialNumber', // 订单序列号
    'productModel', // 产品型号
    'price',
    'quantity',
    'total',
    // 'packagingRequirements', // 包装要求
    // 'bareMachineRequirements', // 裸机要求
    // 'cartonRequirements', // 装箱要求
    'plannedShippingDate', // 计划发货日期
    'actualShippingDate', // 实际发货日期
    'shippingChannel', // 运输渠道
    'internationalLogistics', // 国际物流
    'collectedShippingFee', // 收取运费
    'actualShippingFee', // 实际运费
    'notes', // 备注
    'edit',
    'notify', // admin -> stock
    'receivedByCustomer',
  ];
  dataSource!: MatTableDataSource<Order>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private customersService: CustomersService,
    private ordersService: OrdersService,
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

    this.ordersSub = this.ordersService.orders$.subscribe((orders) => {
      if (orders) {
        this.orders = orders;
        this.dataSource = new MatTableDataSource(this.orders);

        if (this.dataSource) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    });

    this.customersSub = this.customersService.customers$.subscribe(
      (customers) => {
        if (customers) {
          this.customers = customers;
        }
      }
    );

    this.fetchCustomers();
    this.fetchOrders();
  }

  fetchOrders() {
    if (!this.orders || this.orders?.length === 0) {
      this.ordersService.fetchOrders();
    }
  }

  fetchCustomers() {
    if (!this.customers || this.customers?.length === 0) {
      this.customersService.fetchCustomers();
    }
  }

  openOrderDialog(order: Order | null) {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      disableClose: true,
      data: {
        order,
        customers: this.customers,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.event === 'create') {
        await this.createOrder(result);
      } else if (result.event === 'update') {
        await this.updateOrder(result);
      }
    });
  }

  async createOrder(result: any) {
    this.isUploadingOrders = true;
    await this.ordersService.createOrder(
      result.data.formValue,
      this.authService.docUser as DocUser
    );
    this.isUploadingOrders = false;
  }

  async updateOrder(result: any) {
    this.isUploadingOrders = true;
    await this.ordersService.updateOrder(
      result.data.originalOrder,
      result.data.formValue
    );
    this.isUploadingOrders = false;
  }

  notify() {}

  receivedByCustomer() {}

  ngOnDestroy(): void {
    if (this.customersSub) {
      this.customersSub.unsubscribe();
    }

    if (this.ordersSub) {
      this.ordersSub.unsubscribe();
    }

    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
