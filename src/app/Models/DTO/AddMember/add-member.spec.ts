import { AddMember } from './add-member';

describe('AddMember', () => {

  it('should create an instance', () => {
    expect(new AddMember(1, [10, 20, 30])).toBeTruthy();
  });

  it('should correctly assign ChatRoomId', () => {
    const chatRoomId = 123;
    const selectedUsers = [456, 789];
    const addMember = new AddMember(chatRoomId, selectedUsers);

    expect(addMember.ChatRoomId).toEqual(chatRoomId);
  });

  it('should correctly assign SelectedUsers', () => {
    const chatRoomId = 123;
    const selectedUsers = [456, 789];
    const addMember = new AddMember(chatRoomId, selectedUsers);

    expect(addMember.SelectedUsers).toEqual(selectedUsers);
    expect(addMember.SelectedUsers.length).toEqual(2);
  });

  it('should create an instance with an empty SelectedUsers array', () => {
    const chatRoomId = 123;
    const addMember = new AddMember(chatRoomId, []);

    expect(addMember.SelectedUsers).toEqual([]);
    expect(addMember.SelectedUsers.length).toEqual(0);
  });

  it('should create an instance with a single-element SelectedUsers array', () => {
    const chatRoomId = 123;
    const selectedUser = 456;
    const addMember = new AddMember(chatRoomId, [selectedUser]);

    expect(addMember.SelectedUsers).toEqual([selectedUser]);
    expect(addMember.SelectedUsers.length).toEqual(1);
  });

});
