import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  isLoading = false;
  private loadingSub!: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      englishName: form.value.englishName,
    });
  }

  ngOnDestroy() {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
