import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
} from '@angular/fire/firestore';

import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private firestore: Firestore) {}

  async getProducts() {
    return (
      await getDocs(query(collection(this.firestore, 'products')))
    ).docs.map((products) => products.data() as Product);
  }
}
