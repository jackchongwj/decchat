import { Friend } from './friend';

describe('Friend', () => {
  it('should create an instance', () => {
    expect(new Friend(1, 1, 1, 1)).toBeTruthy();
  });
});
