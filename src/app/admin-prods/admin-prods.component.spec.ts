import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdsComponent } from './admin-prods.component';

describe('AdminProdsComponent', () => {
  let component: AdminProdsComponent;
  let fixture: ComponentFixture<AdminProdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
