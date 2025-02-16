import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
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
        this.showSnackbar(error.message);
      });
  }

  login(authData: AuthData) {
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
        this.showSnackbar(error.message);
      });
  }

  logout() {
    signOut(this.auth);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  // todo: create a firestore user when sign up, set up roles in there https://www.youtube.com/watch?v=qWy9ylc3f9U
  // D - todo: setup privacy rule on each table, products: readonly if not login, else read & write if logged in
}
