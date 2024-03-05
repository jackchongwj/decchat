import { Group } from './group';

describe('Group', () => {

  it('should create an instance with specific values', () => {
    const roomName = 'Dev Team';
    const selectedUsers = [1, 2, 3];
    const initiatedBy = 4;
    const userId = 5;

    const group = new Group(roomName, selectedUsers, initiatedBy, userId);

    expect(group).toBeTruthy();
    expect(group.RoomName).toEqual(roomName);
    expect(group.SelectedUsers).toEqual(selectedUsers);
    expect(group.InitiatedBy).toEqual(initiatedBy);
    expect(group.UserId).toEqual(userId);
  });
  
  it('should handle empty user list correctly', () => {
    const groupWithNoUsers = new Group('Empty Group', [], 0, 0);
    expect(groupWithNoUsers.SelectedUsers.length).toBe(0);
  });

});