import { UserChatRoom } from './user-chat-room';

describe('UserChatRoom', () => {
  it('should create an instance', () => {
    expect(new UserChatRoom(1,1,1,true)).toBeTruthy();
  });
});
