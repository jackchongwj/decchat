import { UserSearchDetails } from './user-search-details';

describe('UserSearchDetails', () => {
  it('should create an instance', () => {
    expect(new UserSearchDetails(1,"","","","",1,1)).toBeTruthy();
  });
});
