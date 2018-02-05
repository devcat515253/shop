import { TestBed, inject } from '@angular/core/testing';

import { AuthAdminLoginService } from './auth-admin-login.service';

describe('AuthAdminLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAdminLoginService]
    });
  });

  it('should be created', inject([AuthAdminLoginService], (service: AuthAdminLoginService) => {
    expect(service).toBeTruthy();
  }));
});
