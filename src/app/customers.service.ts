import { Injectable } from '@angular/core';

import {
  Firestore,
  doc,
  addDoc,
  collection,
  getDocs,
  query,
  collectionData,
} from '@angular/fire/firestore';
import { orderBy, setDoc } from 'firebase/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

import { Customer } from './interfaces/customer.model';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async createCustomer(formValue: Customer) {
    let newCustomer: any = { ...formValue };

    // setup reference for product
    newCustomer.products = newCustomer.products.map((obj: any) => {
      let productRef = {
        product: doc(this.firestore, 'products', obj.product.id),
        quantity: obj.quantity,
      };

      return productRef;
    });

    // setup reference for createdBy
    newCustomer.createdBy = doc(
      this.firestore,
      'users',
      this.authService.docUser!.uid
    );

    await addDoc(collection(this.firestore, 'customers'), newCustomer);
  }

  async updateCustomer(formValue: Customer) {}
}
