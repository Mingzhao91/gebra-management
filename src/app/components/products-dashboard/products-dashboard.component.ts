import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

import { Product, ProductPrice } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { UtilsService } from '../../services/utils.service';
import { CATEGORIES, PRODUCTS } from '../../constants/excel';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [
    // angular modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // angular material modules
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    // components
    ProductDialogComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.scss',
})
export class ProductsDashboardComponent {
  products: Product[] | null = [];
  isLoading = true;
  private productsSub!: Subscription;
  private loadingSub!: Subscription;
  // table variables
  displayedColumns: string[] = [
    'select',
    'pictureUrl',
    'modelNumber',
    'category',
    'capacity',
    'prices',
    'description',
    'edit',
  ];
  dataSource!: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);
  isDownloadingExcelFile = false;
  isUploadingProduct = false;
  validDate!: string;
  // filter by categories
  categories = CATEGORIES;
  selectedCategories = new FormControl('');

  @ViewChild('input') filterInput: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService,
    public utilsService: UtilsService,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );

    this.productsSub = this.productService.products$.subscribe((products) => {
      // console.log('from firebase.....');
      // console.log(products);
      this.products = products;

      if (products) {
        this.products = products;

        this.dataSource = new MatTableDataSource(this.products);

        if (this.dataSource) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

        this.dataSource.filterPredicate = this.createFilter();
      }
    });

    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.fetchProducts();
  }

  // ngAfterViewInit() {
  //   if (this.dataSource) {
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //   }
  // }

  // selection
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  async exportExcelButtonOnClick() {
    if (
      this.selection.selected &&
      this.selection.selected.length > 0 &&
      this.validDate
    ) {
      this.isDownloadingExcelFile = true;
      await this.utilsService.exportExcel(
        this.selection.selected,
        this.validDate,
        'products'
      );
      this.isDownloadingExcelFile = false;
    }
  }

  openProductDialog(product: Product | null) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      disableClose: true,
      data: {
        product: product,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.event === 'create') {
        await this.createProduct(result);
      } else if (result.event === 'update') {
        await this.updateProduct(result);
      }
    });
  }

  async createProduct(result: any) {
    this.isUploadingProduct = true;
    await this.productService.createProduct(
      result.data.formValue,
      result.data.fileUpload
    );
    // await this.setTableData();
    this.isUploadingProduct = false;
  }

  async updateProduct(result: any) {
    this.isUploadingProduct = true;
    await this.productService.updateProduct(
      result.data.originalProduct,
      result.data.formValue,
      result.data.fileUpload
    );
    // await this.setTableData();
    this.isUploadingProduct = false;
  }

  // --------------------------   Filtering   -------------------------------//
  // filter by typing
  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

    const filterValue = (event.target as HTMLInputElement).value;

    this.filterValues['typing'] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // {typing: 'XN-M08-2', category: ['Power Bank', 'Speaker']}
  filterValues: { [prop: string]: any } = {};
  // filter by categories
  onCategoriesChange(event: MatSelectChange) {
    // console.log(event);
    this.filterValues['category'] = event.value;

    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter() {
    let filterFn = function (data: any, filter: string): boolean {
      // console.log('data: ');
      // console.log(data);
      // console.log('filter: ');
      // console.log(filter);

      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;

      for (const col in searchTerms) {
        // col: typing, category,....
        // console.log('col: ');
        // console.log(col);

        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      // console.log('searchTerm: ');
      // console.log(searchTerms);

      let searchResult = () => {
        let found = false;
        let isTypingMatched = false; // check against modelNumber, capacity, price
        let isCategoryMatched = false;

        if (isFilterSet) {
          for (const col in searchTerms) {
            if (col === 'typing') {
              searchTerms[col]
                .trim()
                .toLowerCase()
                .split(' ')
                .forEach((word: string) => {
                  // check modelNumber, capacity, price
                  const flatColumnsArr = [
                    'modelNumber',
                    'capacity',
                    'description',
                  ];

                  isTypingMatched = flatColumnsArr.some(
                    (flatColumn) =>
                      data[flatColumn]
                        .toString()
                        .toLowerCase()
                        .indexOf(word) !== -1
                  );

                  // check prices
                  if (data['prices']?.length > 0) {
                    isTypingMatched = data['prices'].some(
                      (priceObj: ProductPrice) =>
                        priceObj.price.toString().trim() === word.trim() ||
                        isTypingMatched
                    );
                  }
                });
            }

            if (col === 'category') {
              if (searchTerms[col].indexOf(data[col]) !== -1) {
                isCategoryMatched = true;
              }
            }
            found = isTypingMatched || isCategoryMatched;
          }

          return found;
        } else {
          return true;
        }
      };

      return searchResult();
    };

    return filterFn;
  }

  resetFilters() {
    this.filterValues = {};

    // reset html inputs
    this.filterInput.nativeElement.value = '';
    this.selectedCategories.reset();

    // reset table filter
    this.dataSource.filter = '';

    // reset paginator
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }

    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
