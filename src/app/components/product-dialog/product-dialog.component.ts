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
  FormArray,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Product, ProductPrice } from '../../interfaces/product';
import { CATEGORIES, CURRENCIES } from '../../constants/excel';

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
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss',
})
export class ProductDialogComponent {
  productForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  categories = CATEGORIES;
  currencies = CURRENCIES;
  fileName!: string;
  imageUploadPreview!: string;
  imageFormData!: FormData;

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
      pictureUrl: [''],
      prices: this.fb.array([]),
    });
  }

  get prices() {
    return this.productForm.controls['prices'] as FormArray;
  }

  createProductPrice() {
    const productPriceFg = this.fb.group({
      currency: ['', Validators.required],
      price: [0, Validators.required],
    });
    (this.productForm.get('prices') as FormArray)?.push(productPriceFg);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // store data for upload
      this.fileName = file.name;
      this.imageFormData = new FormData();
      this.imageFormData.append(file.name, file);

      // set preview
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageUploadPreview = e.target.result;
      };

      reader.readAsDataURL(file);
    }
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
