import { TestBed } from '@angular/core/testing';

import { LocalstorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
