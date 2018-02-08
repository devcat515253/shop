import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubcategoriesComponent } from './admin-subcategories.component';

describe('AdminSubcategoriesComponent', () => {
  let component: AdminSubcategoriesComponent;
  let fixture: ComponentFixture<AdminSubcategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSubcategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
