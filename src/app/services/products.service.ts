import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  addDoc,
  collection,
  getDocs,
  query,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

import { Product } from '../interfaces/product';
import { FileUpload } from '../classes/file-upload';
import { orderBy, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private basePath = `/products`;

  constructor(private firestore: Firestore, private storage: Storage) {}

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

    if (fileUpload) {
      productImageResp = await this.uploadProductImage(fileUpload);

      productToUpdate.picturePath = productImageResp.fullPath;
      productToUpdate.pictureUrl = productImageResp.downloadUrl;
    }

    if (originalProduct.picturePath) {
      await this.deleteProductImage(originalProduct.picturePath);
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
}
