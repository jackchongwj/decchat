import { DeleteFriendRequest } from './delete-friend-request';

describe('DeleteFriendRequest', () => {
  it('should create an instance', () => {
    expect(new DeleteFriendRequest(1,1,1)).toBeTruthy();
  });
});
