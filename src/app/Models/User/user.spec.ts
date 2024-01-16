import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User(1, "Ali", "Mohammad", "d1232t125151","path/pic",false)).toBeTruthy();
  });
});
