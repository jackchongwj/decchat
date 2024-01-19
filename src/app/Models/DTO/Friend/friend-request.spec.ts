import { FriendRequest } from './friend-request';

describe('FriendRequest', () => {
  it('should create an instance', () => {
    expect(new FriendRequest(1,1,"",1)).toBeTruthy();
  });
});
