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
import { UIService } from './services/ui.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private fbSubs: Subscription[] = [];
  customers$ = new Subject<Customer[] | null>();

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private uiService: UIService
  ) {}

  fetchCustomers() {
    this.uiService.loadingStateChanged.next(true);
    const customerObs = collectionData(
      query(collection(this.firestore, 'customers'), orderBy('createdAt')),
      { idField: 'id' }
    ) as Observable<Customer[]>;

    this.fbSubs.push(
      customerObs.subscribe({
        next: (customers) => {
          this.uiService.loadingStateChanged.next(false);
          this.customers$.next([...customers]);
          console.log('customers: ', customers);
        },
        error: (error) => {
          console.log('error.....');
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackboar(
            'Fetching customers failed, please try again later'
          );
          this.customers$.next(null);
        },
      })
    );
  }

  async createCustomer(formValue: Customer) {
    let newCustomer: any = { ...formValue, createdAt: new Date() };

    // // setup reference for product
    // newCustomer.products = newCustomer.products.map((obj: any) => {
    //   let productRef = {
    //     product: doc(this.firestore, 'products', obj.product.id),
    //     quantity: obj.quantity,
    //   };

    //   return productRef;
    // });

    // // setup reference for createdBy
    // newCustomer.createdBy = doc(
    //   this.firestore,
    //   'users',
    //   this.authService.docUser!.uid
    // );

    newCustomer.createdBy = this.authService.docUser;

    await addDoc(collection(this.firestore, 'customers'), newCustomer);
  }

  async updateCustomer(originalCustomer: Customer, formValue: Customer) {
    // console.log('update cust......');
    // console.log('formValue: ', formValue);
    // console.log('originalCustomer: ', originalCustomer);

    let customerToUpdate: any = {
      ...formValue,
      modifiedAt: new Date(),
      id: originalCustomer.id,
    };

    // const customersRef = collection(this.firestore, 'customers');

    // Create a reference to the document with a specific ID
    const docRef = doc(this.firestore, 'customers', customerToUpdate.id);

    // Set the document data
    await setDoc(docRef, customerToUpdate, { merge: true });

    //     await setDoc(doc(customersRef, customerToUpdate.id), customerToUpdate);
  }
}
