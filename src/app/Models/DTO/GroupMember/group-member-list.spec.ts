import { GroupMemberList } from './group-member-list';

describe('GroupMemberList', () => {

  it('should create an instance with default values', () => {
    const defaultGroupMember = new GroupMemberList();
    expect(defaultGroupMember).toBeTruthy();
    expect(defaultGroupMember.ChatRoomId).toEqual(0);
    expect(defaultGroupMember.UserId).toEqual(0);
    expect(defaultGroupMember.ProfileName).toEqual('');
    expect(defaultGroupMember.ProfilePicture).toEqual('');
    expect(defaultGroupMember.SelectedUsers).toEqual([]);
  });

  it('should create an instance with provided values', () => {
    const chatRoomId = 123;
    const userId = 456;
    const profileName = 'John Doe';
    const profilePicture = 'path/to/profile.jpg';
    const selectedUsers = [789, 1011];

    const groupMember = new GroupMemberList(
      chatRoomId,
      userId,
      profileName,
      profilePicture,
      selectedUsers
    );

    expect(groupMember).toBeTruthy();
    expect(groupMember.ChatRoomId).toEqual(chatRoomId);
    expect(groupMember.UserId).toEqual(userId);
    expect(groupMember.ProfileName).toEqual(profileName);
    expect(groupMember.ProfilePicture).toEqual(profilePicture);
    expect(groupMember.SelectedUsers).toEqual(selectedUsers);
  });

});
