import { RefreshToken } from './refresh-token';

describe('RefreshToken', () => {
  it('should create an instance', () => {
    expect(new RefreshToken("4124n1i412ni41",1,"123124125151asdfwf","2020-01-12",false)).toBeTruthy();
  });
});
