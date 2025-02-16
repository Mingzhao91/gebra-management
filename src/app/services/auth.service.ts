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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private productsService: ProductsService
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
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    signOut(this.auth);
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
