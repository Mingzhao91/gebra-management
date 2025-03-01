import { Injectable } from '@angular/core';

import {
  Firestore,
  doc,
  addDoc,
  collection,
  query,
  collectionData,
} from '@angular/fire/firestore';
import { orderBy, setDoc } from 'firebase/firestore';

import { Observable, Subject, Subscription } from 'rxjs';
import moment from 'moment';

import { UIService } from './ui.service';

import { Order } from '../interfaces/order.model';
import { DocUser } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private fbSubs: Subscription[] = [];
  orders$ = new Subject<Order[] | null>();

  constructor(private firestore: Firestore, private uiService: UIService) {}

  fetchOrders() {
    this.uiService.loadingStateChanged.next(true);
    const orderObs = collectionData(
      query(collection(this.firestore, 'orders'), orderBy('createdDate')),
      { idField: 'id' }
    ) as Observable<Order[]>;

    this.fbSubs.push(
      orderObs.subscribe({
        next: (orders) => {
          this.uiService.loadingStateChanged.next(false);
          this.orders$.next([...orders]);
          console.log('orders: ', orders);
        },
        error: (error) => {
          console.log('error.....');
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackboar(
            'Fetching orders failed, please try again later'
          );
          this.orders$.next(null);
        },
      })
    );
  }

  async createOrder(formValue: Order, docUser: DocUser) {
    let newOrder: any = {
      ...formValue,
      createdBy: docUser,
      createdDate: new Date(),
      modifiedDate: new Date(),
      orderSerialNumber: `S-${docUser.englishName}-${moment().format(
        'YYMMDD-HHmmss'
      )}`,
    };

    await addDoc(collection(this.firestore, 'orders'), newOrder);
  }

  async updateOrder(originalOrder: Order, formValue: Order) {
    let orderToUpdate: any = {
      ...formValue,
      modifiedDate: new Date(),
      id: originalOrder.id,
    };

    // Create a reference to the document with a specific ID
    const docRef = doc(this.firestore, 'orders', orderToUpdate.id);

    // Set the document data
    await setDoc(docRef, orderToUpdate, { merge: true });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }
}
