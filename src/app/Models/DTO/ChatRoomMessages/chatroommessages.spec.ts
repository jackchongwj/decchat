import { ChatRoomMessages } from './chatroommessages';

describe('Messages', () => {
  it('should create an instance', () => {
    expect(new ChatRoomMessages(1,"TestRun",3,"12:00:00","path/to/pic",true,1,1,'','')).toBeTruthy();
  });
});
