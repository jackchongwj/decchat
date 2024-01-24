import { TestBed } from '@angular/core/testing';

import { SignalRFriendService } from './signal-rfriend.service';

describe('SignalRFriendService', () => {
  let service: SignalRFriendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalRFriendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
