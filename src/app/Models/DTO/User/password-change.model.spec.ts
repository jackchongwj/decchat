import { PasswordChange } from './password-change';

describe('PasswordChange', () => 
{
    // Test for proper instantiation and property assignment
    it('should correctly assign currentPassword and newPassword when instantiated', () => {
        const currentPassword = 'current123';
        const newPassword = 'newSecure!456';

        const passwordChange = new PasswordChange(currentPassword, newPassword);

        expect(passwordChange.currentPassword).toBe(currentPassword);
        expect(passwordChange.currentPassword).not.toBeNull();
        expect(passwordChange.newPassword).toBe(newPassword);
        expect(passwordChange.newPassword).not.toBeNull();
    });

    // Test should not be null
    it('should not be null', () => {
        const currentPassword = 'current123';
        const newPassword = 'newSecure!456';

        const passwordChange = new PasswordChange(currentPassword, newPassword);

        expect(passwordChange.currentPassword).not.toBeNull();
        expect(passwordChange.newPassword).not.toBeNull();
    });

});



