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
} from '@angular/fire/storage';

import { Product } from '../interfaces/product';
import { FileUpload } from '../classes/file-upload';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private basePath = `/products`;

  constructor(private firestore: Firestore, private storage: Storage) {}

  async getProducts() {
    return (
      await getDocs(query(collection(this.firestore, 'products')))
    ).docs.map((products) => products.data() as Product);
  }

  async createProduct(formValue: Product, fileUpload: FileUpload) {
    let newProductImageResp = null;
    let newProduct = { ...formValue };

    if (fileUpload) {
      newProductImageResp = await this.uploadProductImage(fileUpload);

      newProduct.picturePath = newProductImageResp.fullPath;
      newProduct.pictureUrl = newProductImageResp.downloadUrl;
    }

    await addDoc(collection(this.firestore, 'products'), newProduct);
  }

  async updateProduct(
    originalProduct: Product,
    formValue: Product,
    fileUpload: FileUpload
  ) {}

  async uploadProductImage(fileUpload: FileUpload) {
    const filePath = `${this.basePath}/${
      fileUpload.file.name
    }_${new Date().toISOString()}`;
    const storageRef = ref(this.storage, filePath);
    const uploadResp = await uploadBytesResumable(storageRef, fileUpload.file);
    // console.log('uploadResp: ');
    // console.log(uploadResp);
    // console.log('fullPath: ');
    // console.log(uploadResp.ref.fullPath);

    const downloadUrl = await getDownloadURL(uploadResp.ref);
    // console.log('downloadUrl: ');
    // console.log(downloadUrl);

    return {
      fullPath: uploadResp.ref.fullPath,
      downloadUrl,
    };
  }

  async deleteProductImage() {}
}
