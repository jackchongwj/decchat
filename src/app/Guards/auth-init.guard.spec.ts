import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authInitGuard } from './auth-init.guard';

describe('authInitGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authInitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
