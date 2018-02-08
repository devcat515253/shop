import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTypeProdPropertyComponent } from './admin-type-prod-property.component';

describe('AdminTypeProdPropertyComponent', () => {
  let component: AdminTypeProdPropertyComponent;
  let fixture: ComponentFixture<AdminTypeProdPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTypeProdPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTypeProdPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
