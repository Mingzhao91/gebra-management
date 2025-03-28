import { Component, EventEmitter, Output } from '@angular/core';

import { RouterLink } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { Subscription } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { APP_MENUS_CHN } from '../../../constants/excel';
@Component({
  selector: 'app-sidenav-list',
  standalone: true,
  imports: [RouterLink, MatListModule, MatIconModule],
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.scss',
})
export class SidenavListComponent {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth!: boolean;
  authSubscription!: Subscription;
  APP_MENUS_CHN = APP_MENUS_CHN;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(
      (authStatus) => (this.isAuth = authStatus)
    );
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestro() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
