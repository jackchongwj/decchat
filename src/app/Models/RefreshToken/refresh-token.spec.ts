import { RefreshToken } from './refresh-token';

describe('RefreshToken', () => {
  // Test for successful instantiation and property assignment
  it('should correctly assign properties when instantiated', () => {
      const tokenId = 'token123';
      const userId = 1;
      const tokenHash = 'PbM5UlmnmZCH5oR3y/yPqnRERI3+wf3jvtlcknwGlMM=';
      const expiredDateTime = '2023-12-31T23:59:59Z';
      const isDeleted = false;

      const refreshToken = new RefreshToken(
          tokenId,
          userId,
          tokenHash,
          expiredDateTime,
          isDeleted
      );

      expect(refreshToken.TokenId).toEqual(tokenId);
      expect(refreshToken.UserId).toEqual(userId);
      expect(refreshToken.TokenHash).toEqual(tokenHash);
      expect(refreshToken.ExpiredDateTime).toEqual(expiredDateTime);
      expect(refreshToken.IsDeleted).toBe(isDeleted);
  });

  // Test the handling of null for nullable fields
  it('should allow null for TokenId', () => {
      const refreshToken = new RefreshToken(
          null, // TokenId is null
          2,
          'hashvalue2',
          '2024-01-01T00:00:00Z',
          true
      );

      expect(refreshToken.TokenId).toBeNull();
  });

  // Test for the correct handling of IsDeleted property
  it('should accurately reflect the IsDeleted state', () => {
      // IsDeleted is true
      const deletedToken = new RefreshToken('token456', 3, 'hashvalue3', '2023-06-30T12:00:00Z', true);
      expect(deletedToken.IsDeleted).toBeTrue();

      // IsDeleted is false
      const activeToken = new RefreshToken('token789', 4, 'hashvalue4', '2023-11-30T11:59:59Z', false);
      expect(activeToken.IsDeleted).toBeFalse();
  });

});
