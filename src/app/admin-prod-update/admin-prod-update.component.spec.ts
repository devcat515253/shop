import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdUpdateComponent } from './admin-prod-update.component';

describe('AdminProdUpdateComponent', () => {
  let component: AdminProdUpdateComponent;
  let fixture: ComponentFixture<AdminProdUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProdUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProdUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
