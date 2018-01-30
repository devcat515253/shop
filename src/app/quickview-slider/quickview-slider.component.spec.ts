import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickviewSliderComponent } from './quickview-slider.component';

describe('QuickviewSliderComponent', () => {
  let component: QuickviewSliderComponent;
  let fixture: ComponentFixture<QuickviewSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickviewSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickviewSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
