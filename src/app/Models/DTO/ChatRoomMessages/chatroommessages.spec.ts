import { ChatRoomMessages } from './chatroommessages';

describe('ChatRoomMessages', () => {

  it('should create an instance with mandatory and default values', () => {
    const messageId = null;
    const content = 'Hello, world!';
    const userChatRoomId = 1;
    const timeStamp = null; // Assuming nullable for demonstration
    const resourceUrl = ''; // Default value expected
    const isDeleted = false;
    const chatRoomId = 2;
    const userId = 3;
    const profileName = ''; // Default value expected
    const profilePicture = ''; // Default value expected

    const message = new ChatRoomMessages(
      messageId, content, userChatRoomId, timeStamp, 
      resourceUrl, isDeleted, chatRoomId, userId, 
      profileName, profilePicture
    );

    expect(message).toBeTruthy();
    expect(message.MessageId).toBeNull();
    expect(message.Content).toEqual(content);
    expect(message.UserChatRoomId).toEqual(userChatRoomId);
    expect(message.TimeStamp).toBeNull();
    expect(message.ResourceUrl).toEqual(resourceUrl);
    expect(message.IsDeleted).toEqual(isDeleted);
    expect(message.ChatRoomId).toEqual(chatRoomId);
    expect(message.UserId).toEqual(userId);
    expect(message.ProfileName).toEqual(profileName);
    expect(message.ProfilePicture).toEqual(profilePicture);
  });

  it('should correctly initialize with provided values including optional and default overrides', () => {
    const messageId = 123;
    const content = 'This is a test message.';
    const userChatRoomId = 456;
    const timeStamp = '2023-01-01T00:00:00Z';
    const resourceUrl = 'http://example.com/resource';
    const isDeleted = true;
    const chatRoomId = 789;
    const userId = 1011;
    const profileName = 'John Doe';
    const profilePicture = 'http://example.com/profile.jpg';

    const message = new ChatRoomMessages(
      messageId, content, userChatRoomId, timeStamp, 
      resourceUrl, isDeleted, chatRoomId, userId, 
      profileName, profilePicture
    );

    expect(message.MessageId).toEqual(messageId);
    expect(message.Content).toEqual(content);
    expect(message.UserChatRoomId).toEqual(userChatRoomId);
    expect(message.TimeStamp).toEqual(timeStamp);
    expect(message.ResourceUrl).toEqual(resourceUrl);
    expect(message.IsDeleted).toBeTrue();
    expect(message.ChatRoomId).toEqual(chatRoomId);
    expect(message.UserId).toEqual(userId);
    expect(message.ProfileName).toEqual(profileName);
    expect(message.ProfilePicture).toEqual(profilePicture);
  });

});
