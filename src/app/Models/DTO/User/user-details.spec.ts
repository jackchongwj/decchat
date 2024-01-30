import { UserDetails } from './user-details';

describe('UserDetails', () => {
  it('should create an instance', () => {
    expect(new UserDetails(1,"","","","",1,1)).toBeTruthy();
  });
});
