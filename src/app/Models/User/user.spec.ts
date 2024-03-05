import { User } from './user';

describe('User', () => {
  // Test for successful instantiation and property assignment
  it('should correctly assign properties when instantiated', () => {
      const userId = 100;
      const userName = 'johndoe';
      const profileName = 'John Doe';
      const password = 'securePassword123';
      const profilePicture = 'path/to/picture.jpg';
      const isDeleted = false;

      const user = new User(
          userId,
          userName,
          profileName,
          password,
          profilePicture,
          isDeleted
      );

      expect(user.UserId).toEqual(userId);
      expect(user.UserName).toEqual(userName);
      expect(user.ProfileName).toEqual(profileName);
      expect(user.Password).toEqual(password);
      expect(user.ProfilePicture).toEqual(profilePicture);
      expect(user.IsDeleted).toBe(isDeleted);
  });

  // Test nullable UserId
  it('should allow null for UserId', () => {
      const user = new User(
          null, 
          'janedoe',
          'Jane Doe',
          'anotherSecurePassword456',
          'path/to/another/picture.jpg',
          true
      );

      expect(user.UserId).toBeNull();
  });

  // Test for logical consistency in deletion status
  it('should correctly reflect deletion status', () => {
      const activeUser = new User(103, 'activeadam', 'Active Adam', 'ActivePassword!123', 'path/to/adam/picture.jpg', false);
      expect(activeUser.IsDeleted).toBeFalse();

      const deletedUser = new User(104, 'deleteddiana', 'Deleted Diana', 'DeletedPassword123', 'path/to/diana/picture.jpg', true);
      expect(deletedUser.IsDeleted).toBeTrue();
  });

});