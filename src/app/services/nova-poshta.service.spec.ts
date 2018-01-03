import { TestBed, inject } from '@angular/core/testing';

import { NovaPoshtaService } from './nova-poshta.service';

describe('NovaPoshtaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NovaPoshtaService]
    });
  });

  it('should be created', inject([NovaPoshtaService], (service: NovaPoshtaService) => {
    expect(service).toBeTruthy();
  }));
});
