import { ChatListVM } from './chat-list-vm';

describe('ChatListVM', () => {

  it('should create an instance with default values', () => {
      const chatListVM = new ChatListVM();
      expect(chatListVM).toBeTruthy();
      expect(chatListVM.ChatRoomId).toEqual(0);
      expect(chatListVM.ChatRoomName).toEqual('');
      expect(chatListVM.ProfileName).toEqual('');
      expect(chatListVM.ProfilePicture).toEqual('');
      expect(chatListVM.RoomType).not.toBeTruthy();
      expect(chatListVM.RoomType).toBeNull();
      expect(chatListVM.SelectedUsers).toEqual([]);
      expect(chatListVM.UserChatRoomId).toEqual(0);
      expect(chatListVM.UserId).toEqual(0);
      expect(chatListVM.InitiatedBy).toEqual(0);
      expect(chatListVM.InitiatorProfileName).toEqual('');
      expect(chatListVM.IsOnline).toBeFalse();
  });

  it('should create an instance with provided values', () => {
      const chatListVM = new ChatListVM(
          1, 
          'General',
          'John Doe', 
          'path/to/image.jpg', 
          true,
          [2, 3], 
          4, 
          5, 
          6, 
          'Jane Doe', 
          true
      );

      expect(chatListVM).toBeTruthy();
      expect(chatListVM.ChatRoomId).toEqual(1);
      expect(chatListVM.ChatRoomName).toEqual('General');
      expect(chatListVM.ProfileName).toEqual('John Doe');
      expect(chatListVM.ProfilePicture).toEqual('path/to/image.jpg');
      expect(chatListVM.RoomType).toBeTrue();
      expect(chatListVM.SelectedUsers).toEqual([2, 3]);
      expect(chatListVM.UserChatRoomId).toEqual(4);
      expect(chatListVM.UserId).toEqual(5);
      expect(chatListVM.InitiatedBy).toEqual(6);
      expect(chatListVM.InitiatorProfileName).toEqual('Jane Doe');
      expect(chatListVM.IsOnline).toBeTrue();
  });

});