import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
} from '@angular/fire/auth';

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

import { Subject } from 'rxjs';

import { AuthData } from '../interfaces/auth-data.model';
import { ProductsService } from './products.service';
import { UIService } from './ui.service';
import { DocUser } from '../interfaces/user.model';
import { CustomersService } from '../customers.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  docUser$ = new Subject<DocUser | null>();
  private isAuthenticated = false;
  authUser!: User | null;
  docUser!: DocUser | null;

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private uiService: UIService
  ) {}

  initAuthListener() {
    authState(this.auth).subscribe(async (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.authUser = user;
        await this.getDocUserAndSent(user.uid);
        console.log('authStateChange...., this.docUser: ', this.docUser);
        // TODO: navigate to customers or products depending on role
        this.router.navigate(['/customers']);
      } else {
        this.productsService.cancelSubscriptions();
        this.customersService.cancelSubscriptions();
        this.authChange.next(false);
        this.authUser = null;
        this.docUser = null;
        this.docUser$.next(null);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  async registerUser(authData: AuthData) {
    try {
      this.uiService.loadingStateChanged.next(true);
      const result = await createUserWithEmailAndPassword(
        this.auth,
        authData.email,
        authData.password
      );
      // console.log('result: ', result);

      const userData = {
        firstName: authData.firstName,
        lastName: authData.lastName,
        englishName: authData.englishName,
        email: authData.email,
        roles: [],
      };

      const userRef = doc(this.firestore, 'users', result.user.uid);
      await setDoc(userRef, userData);
      await this.getDocUserAndSent(result.user.uid);
      this.uiService.loadingStateChanged.next(false);
    } catch (error: any) {
      console.log(error);
      this.uiService.showSnackboar(error.message);
      this.docUser = null;
      this.docUser$.next(null);
      this.uiService.loadingStateChanged.next(false);
    }
  }

  async getDocUserAndSent(uid: string) {
    this.docUser = (await this.getDocById(uid, 'users')) as DocUser;

    // console.log('this.docUser: ', this.docUser);

    this.docUser$.next(this.docUser);
  }

  async login(authData: AuthData) {
    try {
      this.uiService.loadingStateChanged.next(true);
      const result = await signInWithEmailAndPassword(
        this.auth,
        authData.email,
        authData.password
      );
      await this.getDocUserAndSent(result.user.uid);
      this.uiService.loadingStateChanged.next(false);
    } catch (error: any) {
      console.log(error);
      this.docUser = null;
      this.docUser$.next(null);
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackboar(error.message);
    }
  }

  logout() {
    signOut(this.auth);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  async getDocById(uid: string, collectionName: string) {
    const ref = doc(this.firestore, collectionName, uid);
    const snap = await getDoc(ref);
    return snap.exists() ? { uid: snap.id, ...snap.data() } : null;
  }
}
