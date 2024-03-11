import { Friend } from './friend';

describe('Friend', () => {
  it('should create an instance with specified properties', () => {
      const requestId = 123;
      const senderId = 1;
      const receiverId = 2;
      const status = 1;

      const friend = new Friend(requestId, senderId, receiverId, status);

      expect(friend.RequestId).toEqual(requestId);
      expect(friend.SenderId).toEqual(senderId);
      expect(friend.ReceiverId).toEqual(receiverId);
      expect(friend.Status).toEqual(status);
  });

  it('should allow null for RequestId', () => {
      const friend = new Friend(null, 1, 2, 0);
      expect(friend.RequestId).toBeNull();
  });

  // Test Friend Status
  it('should correctly assign status codes', () => {
      const pending = new Friend(123, 1, 2, 1); 
      expect(pending.Status).toEqual(1);

      const accepted = new Friend(124, 1, 2, 2); 
      expect(accepted.Status).toEqual(2);

      const rejected = new Friend(125, 1, 2, 3); 
      expect(rejected.Status).toEqual(3);

      const deleted = new Friend(125, 1, 2, 4); 
      expect(deleted.Status).toEqual(4);
  });

});
