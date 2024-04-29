import { Component, Inject } from '@angular/core';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatButtonModule, MatDialogModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss',
})
export class ProductDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product }) {}

  ngOnInit() {
    console.log(this.data);
  }
}
