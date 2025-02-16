import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  loadingStateChanged = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) {}

  showSnackboar(message: string, action: string = '', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
