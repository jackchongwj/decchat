import { EditMessage } from './edit-message';

describe('EditMessage', () => {

  it('should create an instance', () => {
    expect(new EditMessage(1, 'Hello World', 101)).toBeTruthy();
  });

  it('should accept null for MessageId', () => {
    const message = new EditMessage(null, 'Hello World', 101);
    expect(message.MessageId).toBeNull();
    expect(message.Content).toBe('Hello World');
    expect(message.ChatRoomId).toBe(101);
  });

  it('should set all provided attributes', () => {
    const messageId = 123;
    const content = 'This is a test message';
    const chatRoomId = 456;
    const message = new EditMessage(messageId, content, chatRoomId);

    expect(message.MessageId).toEqual(messageId);
    expect(message.Content).toEqual(content);
    expect(message.ChatRoomId).toEqual(chatRoomId);
  });

});
