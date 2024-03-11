import { Chatroom } from './chatroom';

describe('Chatroom', () => {
  it('should create an instance with specified properties', () => {
    const chatRoomId = 1;
    const roomName = 'Test Room';
    const createdDate = '2023-01-01T00:00:00Z';
    const roomType = true;
    const roomProfilePic = 'path/to/image.jpg';
    const initiatedBy = 101;
    const isDeleted = false;

    const chatroom = new Chatroom(
      chatRoomId,
      roomName,
      createdDate,
      roomType,
      roomProfilePic,
      initiatedBy,
      isDeleted
    );

    // Verify that the properties are correctly assigned
    expect(chatroom.ChatRoomId).toEqual(chatRoomId);
    expect(chatroom.RoomName).toEqual(roomName);
    expect(chatroom.CreatedDate).toEqual(createdDate);
    expect(chatroom.RoomType).toBe(roomType);
    expect(chatroom.RoomProfilePic).toEqual(roomProfilePic);
    expect(chatroom.InitiatedBy).toEqual(initiatedBy);
    expect(chatroom.IsDeleted).toBe(isDeleted);
  });

  it('should allow null for ChatRoomId', () => {
    const roomName = 'Test Room';
    const createdDate = '2023-01-01T00:00:00Z';
    const roomType = true;
    const roomProfilePic = 'path/to/image.jpg';
    const initiatedBy = 101;
    const isDeleted = false;

    const chatroom = new Chatroom(
      null,
      roomName,
      createdDate,
      roomType,
      roomProfilePic,
      initiatedBy,
      isDeleted
    );
    expect(chatroom.ChatRoomId).toBeNull();
  });


});