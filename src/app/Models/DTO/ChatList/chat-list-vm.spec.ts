import { ChatListVM } from './chat-list-vm';

describe('ChatListVM', () => {
  it('should create an instance', () => {
    expect(new ChatListVM("","","","",null,0)).toBeTruthy();
  });
});
