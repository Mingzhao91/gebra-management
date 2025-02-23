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
// import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Observable, Subject, Subscription } from 'rxjs';

import { Product } from '../interfaces/product.model';
import { FileUpload } from '../classes/file-upload';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private basePath = `/products`;
  private fbSubs: Subscription[] = [];

  products$ = new Subject<Product[] | null>();

  constructor(
    private firestore: Firestore,
    private storage: Storage, // private readonly afs: AngularFirestore
    private uiService: UIService
  ) {}

  fetchProducts() {
    this.uiService.loadingStateChanged.next(true);
    const productObs = collectionData(
      query(collection(this.firestore, 'products'), orderBy('modelNumber')),
      { idField: 'id' }
    ) as Observable<Product[]>;

    this.fbSubs.push(
      productObs.subscribe({
        next: (products) => {
          this.uiService.loadingStateChanged.next(false);
          this.products$.next([...products]);
        },
        error: (error) => {
          console.log('error.....');
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackboar(
            'Fetching products failed, please try again later'
          );
          this.products$.next(null);
        },
      })
    );
  }

  // deprecated as we're using subscription now
  async getProducts() {
    return (
      await getDocs(
        query(collection(this.firestore, 'products'), orderBy('modelNumber'))
      )
    ).docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as Product;
    });
  }

  async createProduct(formValue: Product, fileUpload: FileUpload) {
    let productImageResp = null;
    let newProduct = { ...formValue };

    if (fileUpload) {
      productImageResp = await this.uploadProductImage(fileUpload);

      newProduct.picturePath = productImageResp.fullPath;
      newProduct.pictureUrl = productImageResp.downloadUrl;
    }

    await addDoc(collection(this.firestore, 'products'), newProduct);
  }

  async updateProduct(
    originalProduct: Product,
    formValue: Product,
    fileUpload: FileUpload
  ) {
    let productImageResp = null;
    let productToUpdate = { ...formValue };

    // console.log('original product: ', originalProduct);
    // console.log('fileUpload: ', fileUpload);

    if (fileUpload) {
      productImageResp = await this.uploadProductImage(fileUpload);

      productToUpdate.picturePath = productImageResp.fullPath;
      productToUpdate.pictureUrl = productImageResp.downloadUrl;

      if (originalProduct.picturePath) {
        await this.deleteProductImage(originalProduct.picturePath);
      }
    }

    const productsRef = collection(this.firestore, 'products');

    await setDoc(doc(productsRef, originalProduct.id), productToUpdate);
  }

  async uploadProductImage(fileUpload: FileUpload) {
    const filePath = `${this.basePath}/${
      fileUpload.file.name
    }_${new Date().toISOString()}`;
    const storageRef = ref(this.storage, filePath);
    const uploadResp = await uploadBytesResumable(storageRef, fileUpload.file);
    const downloadUrl = await getDownloadURL(uploadResp.ref);

    return {
      fullPath: uploadResp.ref.fullPath,
      downloadUrl,
    };
  }

  async deleteProductImage(picturePath: string) {
    const desertRef = ref(this.storage, picturePath);
    await deleteObject(desertRef);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }
}
