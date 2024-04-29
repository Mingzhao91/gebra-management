import { Component, Inject } from '@angular/core';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Product } from '../../interfaces/product';
import { CATEGORIES } from '../../constants/excel';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss',
})
export class ProductDialogComponent {
  productForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  categories = CATEGORIES;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.productForm = this.fb.group({
      modelNumber: ['', Validators.required],
      capacity: [''],
      category: ['', Validators.required],
      description: ['', Validators.required],
      pictureUrl: ['', Validators.required],
      prices: this.fb.array([]),
    });
  }

  test() {
    console.log(this.productForm);
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
