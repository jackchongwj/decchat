import { UserSearchDetails } from './user-search-details';

describe('UserSearchDetails', () => {
  
  it('should correctly assign properties when instantiated', () => {
      const userId = 1;
      const userName = 'johndoe';
      const profileName = 'John Doe';
      const password = 'password123';
      const profilePicture = 'url/to/picture.jpg';
      const status = 1; 
      const isDelete = 0; 

      const userSearchDetails = new UserSearchDetails(
          userId,
          userName,
          profileName,
          password,
          profilePicture,
          status,
          isDelete
      );

      expect(userSearchDetails.UserId).toEqual(userId);
      expect(userSearchDetails.UserName).toEqual(userName);
      expect(userSearchDetails.ProfileName).toEqual(profileName);
      expect(userSearchDetails.Password).toEqual(password);
      expect(userSearchDetails.ProfilePicture).toEqual(profilePicture);
      expect(userSearchDetails.Status).toEqual(status);
      expect(userSearchDetails.IsDelete).toEqual(isDelete);
  });

  // Test Friend Status
  it('should correctly assign status codes', () => {
    const pending = new UserSearchDetails(6, 'pendingUser', 'Active User', 'pass456', 'url/to/active.jpg', 1, 0);
    expect(pending.Status).toEqual(1);

    const accepted = new UserSearchDetails(6, 'friendUser', 'Active User', 'pass456', 'url/to/active.jpg', 2, 0);
    expect(accepted.Status).toEqual(2);

    const rejected = new UserSearchDetails(6, 'rejectedUser', 'Active User', 'pass456', 'url/to/active.jpg', 3, 0);
    expect(rejected.Status).toEqual(3);

    const deleted = new UserSearchDetails(6, 'deletedUser', 'Active User', 'pass456', 'url/to/active.jpg', 4, 0);
    expect(deleted.Status).toEqual(4);
  });

  it('should correctly reflect deletion status based on IsDelete property', () => {
    const deletedUser = new UserSearchDetails(5, 'deletedUser', 'Deleted User', 'pass123', 'url/to/deleted.jpg', 0, 1); // 1 means deleted
    expect(deletedUser.IsDelete).toBeTrue();

    const activeUser = new UserSearchDetails(6, 'activeUser', 'Active User', 'pass456', 'url/to/active.jpg', 0, 0); // 0 means not deleted
    expect(activeUser.IsDelete).toBeFalse();
});

});

