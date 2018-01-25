import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdAddComponent } from './admin-prod-add.component';

describe('AdminProdAddComponent', () => {
  let component: AdminProdAddComponent;
  let fixture: ComponentFixture<AdminProdAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProdAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProdAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
