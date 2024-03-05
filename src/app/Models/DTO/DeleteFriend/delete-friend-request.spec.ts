import { DeleteFriendRequest } from './delete-friend-request';

describe('DeleteFriendRequest', () => {

  it('should create an instance with specific values', () => {
    const chatRoomId = 123;
    const userId1 = 456;
    const userId2 = 789;

    const deleteFriendRequest = new DeleteFriendRequest(chatRoomId, userId1, userId2);

    expect(deleteFriendRequest).toBeTruthy();
    expect(deleteFriendRequest.ChatRoomId).toEqual(chatRoomId);
    expect(deleteFriendRequest.UserId1).toEqual(userId1);
    expect(deleteFriendRequest.UserId2).toEqual(userId2);
  });
  
});