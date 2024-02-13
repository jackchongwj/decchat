import { TestBed } from '@angular/core/testing';

import { ChatlistService } from './chatlist.service';

describe('ChatlistService', () => {
  let service: ChatlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
