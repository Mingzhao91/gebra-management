import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
} from '@angular/fire/auth';

import { Subject } from 'rxjs';

import { AuthData } from '../interfaces/auth-data.model';
import { ProductsService } from './products.service';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private productsService: ProductsService,
    private uiService: UIService
  ) {}

  initAuthListener() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        // TODO: navigate to customers or products depending on role
        this.router.navigate(['/products']);
      } else {
        this.productsService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        console.log(error);
        this.uiService.showSnackboar(error.message);
        this.uiService.loadingStateChanged.next(false);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        console.log(error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackboar(error.message);
      });
  }

  logout() {
    signOut(this.auth);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  // todo: create a firestore user when sign up, set up roles in there https://www.youtube.com/watch?v=qWy9ylc3f9U
  // D - todo: setup privacy rule on each table, products: readonly if not login, else read & write if logged in
}
