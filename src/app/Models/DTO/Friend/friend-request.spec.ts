import { FriendRequest } from './friend-request';

describe('FriendRequest', () => {

  it('should create an instance with specific values', () => {
    const receiverId = 100;
    const senderId = 200;
    const status = 1;

    const friendRequest = new FriendRequest(receiverId, senderId, status);

    expect(friendRequest).toBeTruthy();
    expect(friendRequest.ReceiverId).toEqual(receiverId);
    expect(friendRequest.SenderId).toEqual(senderId);
    expect(friendRequest.Status).toEqual(status);
  });

  
  it('should correctly initialize with different statuses', () => {
    const statusAccepted = 2; 
    const statusRejected = 3; 
    const statusDeleted = 4; 
    const friendRequestAccepted = new FriendRequest(100, 200, statusAccepted);
    const friendRequestRejected = new FriendRequest(100, 200, statusRejected);
    const friendRequestDeleted = new FriendRequest(100, 200, statusDeleted);

    expect(friendRequestAccepted.Status).toEqual(statusAccepted);
    expect(friendRequestRejected.Status).toEqual(statusRejected);
    expect(friendRequestDeleted.Status).toEqual(statusDeleted);
  });

});