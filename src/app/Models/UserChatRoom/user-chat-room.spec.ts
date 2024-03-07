import { UserChatRoom } from './user-chat-room';

describe('UserChatRoom', () => {
  // Test successful instantiation and property assignments
  it('should correctly assign properties when instantiated', () => {
      const userChatRoomId = 100;
      const userId = 1;
      const chatRoomId = 2;
      const isDeleted = false;

      const userChatRoom = new UserChatRoom(
          userChatRoomId,
          userId,
          chatRoomId,
          isDeleted
      );

      expect(userChatRoom.UserChatRoomId).toEqual(userChatRoomId);
      expect(userChatRoom.UserId).toEqual(userId);
      expect(userChatRoom.ChatRoomId).toEqual(chatRoomId);
      expect(userChatRoom.IsDeleted).toBe(isDeleted);
  });

  // Test nullable UserChatRoomId
  it('should allow null for UserChatRoomId', () => {
      const userChatRoom = new UserChatRoom(
          null, // UserChatRoomId is null
          3,
          4,
          true
      );

      expect(userChatRoom.UserChatRoomId).toBeNull();
  });

  // Test for logical consistency in deletion status
  it('should accurately reflect the IsDeleted state', () => {
      // Instance where IsDeleted is true
      const deletedUserChatRoom = new UserChatRoom(200, 5, 6, true);
      expect(deletedUserChatRoom.IsDeleted).toBeTrue();

      // Instance where IsDeleted is false
      const activeUserChatRoom = new UserChatRoom(300, 7, 8, false);
      expect(activeUserChatRoom.IsDeleted).toBeFalse();
  });

});