import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProgressComponent } from './sales-progress.component';

describe('SaleProgressComponent', () => {
  let component: SaleProgressComponent;
  let fixture: ComponentFixture<SaleProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
