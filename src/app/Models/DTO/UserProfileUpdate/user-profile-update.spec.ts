import { UserProfileUpdate } from './user-profile-update';

describe('UserProfileUpdate', () => {
  // Test for default values
  it('should have default values for all properties', () => {
      const defaultProfile = new UserProfileUpdate();

      expect(defaultProfile.UserId).toEqual(0);
      expect(defaultProfile.ProfileName).toEqual('');
      expect(defaultProfile.ProfilePicture).toEqual('');
  });

  it('should correctly assign properties when provided', () => {
      const userId = 123;
      const profileName = 'Jane Doe';
      const profilePicture = 'path/to/picture.jpg';

      const profileUpdate = new UserProfileUpdate(userId, profileName, profilePicture);

      expect(profileUpdate.UserId).toEqual(userId);
      expect(profileUpdate.ProfileName).toEqual(profileName);
      expect(profileUpdate.ProfilePicture).toEqual(profilePicture);
  });

  it('should not be null', () => {
    const defaultProfile = new UserProfileUpdate();

    expect(defaultProfile.UserId).not.toBeNull;
    expect(defaultProfile.ProfileName).not.toBeNull;
    expect(defaultProfile.ProfilePicture).not.toBeNull;
  });

});

