import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SALES_PROGRESSES } from '../../constants/excel';
import { SalesProgress } from '../../interfaces/customer.model';

@Component({
  selector: 'app-sales-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-progress.component.html',
  styleUrl: './sales-progress.component.scss',
})
export class SaleProgressComponent {
  @Input('currentProgress') currentProgress!: SalesProgress;
  @Input('isDisabled') isDisabled = false;
  @Output('setSalesProgress') setSalesProgress =
    new EventEmitter<SalesProgress>();

  salesProgresses = SALES_PROGRESSES;

  getWidth() {
    return `${100 / SALES_PROGRESSES.length}%`;
  }

  onSalesProgressClick(index: number) {
    this.currentProgress = this.salesProgresses[index];
    this.setSalesProgress.emit(this.currentProgress);
  }
}
