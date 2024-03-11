import { Message } from './message';

describe('Message', () => {
  it('should correctly assign all properties when created', () => {
      const messageId = 1;
      const content = 'Hello, World!';
      const userChatRoomId = 2;
      const timeStamp = '2023-03-15T12:34:56Z';
      const resourceUrl = 'http://example.com/resource.jpg';
      const isDeleted = false;

      const message = new Message(
          messageId,
          content,
          userChatRoomId,
          timeStamp,
          resourceUrl,
          isDeleted
      );

      expect(message.MessageId).toEqual(messageId);
      expect(message.Content).toEqual(content);
      expect(message.UserChatRoomId).toEqual(userChatRoomId);
      expect(message.TimeStamp).toEqual(timeStamp);
      expect(message.ResourceUrl).toEqual(resourceUrl);
      expect(message.IsDeleted).toBe(isDeleted);
  });

  // Testing nullability for MessageId and TimeStamp
  it('should allow null for MessageId and TimeStamp', () => {
      const message = new Message(
          null,
          'Test Content',
          3,
          null,
          null,
          true
      );

      expect(message.MessageId).toBeNull();
      expect(message.ResourceUrl).toBeNull(); 
      expect(message.TimeStamp).toBeNull();
  });

  // Testing behavior for IsDeleted flag
  it('should correctly assign the IsDeleted flag', () => {
      const message = new Message(
          2,
          'Another message',
          4,
          '2023-03-15T15:00:00Z',
          null,
          true
      );

      const message2 = new Message(
        2,
        'Another message',
        4,
        '2023-03-15T15:00:00Z',
        null,
        false
    );

      expect(message.IsDeleted).toBeTrue();
      expect(message2.IsDeleted).toBeFalse();
  });
});