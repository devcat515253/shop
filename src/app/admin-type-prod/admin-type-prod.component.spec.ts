import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTypeProdComponent } from './admin-type-prod.component';

describe('AdminTypeProdComponent', () => {
  let component: AdminTypeProdComponent;
  let fixture: ComponentFixture<AdminTypeProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTypeProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTypeProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
