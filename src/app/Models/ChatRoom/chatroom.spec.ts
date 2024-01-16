import { Chatroom } from './chatroom';

describe('Chatroom', () => {
  it('should create an instance', () => {
    expect(new Chatroom(1, 'Test Room', '2021-01-01', true, 'path/to/pic', 123, false)).toBeTruthy();
  });
});
