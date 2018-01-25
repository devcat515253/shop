import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderDelailComponent } from './admin-order-delail.component';

describe('AdminOrderDelailComponent', () => {
  let component: AdminOrderDelailComponent;
  let fixture: ComponentFixture<AdminOrderDelailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderDelailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderDelailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
