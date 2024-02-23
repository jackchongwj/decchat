import { ChatListVM } from './chat-list-vm';

describe('ChatListVM', () => {
  it('should create an instance', () => {
    expect(new ChatListVM(0,"","", "",null,[],0,0, 0)).toBeTruthy();
  });
});
