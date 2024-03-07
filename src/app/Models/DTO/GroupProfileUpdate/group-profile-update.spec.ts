import { GroupProfileUpdate } from './group-profile-update';

describe('GroupProfileUpdate', () => {

  it('should create an instance with default values', () => {
    const defaultGroupProfile = new GroupProfileUpdate();
    expect(defaultGroupProfile).toBeTruthy();
    expect(defaultGroupProfile.ChatRoomId).toEqual(0);
    expect(defaultGroupProfile.GroupName).toEqual('');
    expect(defaultGroupProfile.GroupPicture).toEqual('');
  });

  it('should create an instance with provided values', () => {
    const chatRoomId = 123;
    const groupName = 'Test Group';
    const groupPicture = 'path/to/picture.jpg';
    const groupProfile = new GroupProfileUpdate(chatRoomId, groupName, groupPicture);

    expect(groupProfile).toBeTruthy();
    expect(groupProfile.ChatRoomId).toEqual(chatRoomId);
    expect(groupProfile.GroupName).toEqual(groupName);
    expect(groupProfile.GroupPicture).toEqual(groupPicture);
  });

});