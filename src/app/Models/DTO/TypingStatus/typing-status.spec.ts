import { TypingStatus } from './typing-status';

describe('TypingStatus', () => {
    // Test default constructor behavior
    it('should initialize with default values when no arguments are provided', () => {
        const defaultTypingStatus = new TypingStatus();

        expect(defaultTypingStatus.ChatRoomId).toEqual(0);
        expect(defaultTypingStatus.isTyping).toBeFalse();
        expect(defaultTypingStatus.currentUserProfileName).toEqual('');
    });

    // Test constructor behavior with arguments
    it('should correctly assign properties when instantiated with arguments', () => {
        const chatRoomId = 123;
        const isTyping = true;
        const currentUserProfileName = 'John Doe';

        const typingStatus = new TypingStatus(chatRoomId, isTyping, currentUserProfileName);

        expect(typingStatus.ChatRoomId).toEqual(chatRoomId);
        expect(typingStatus.isTyping).toBe(isTyping);
        expect(typingStatus.currentUserProfileName).toEqual(currentUserProfileName);
    });

    // Test typing status true
    it('should reflect typing status correctly, case: True', () => {

        const typingStatus = new TypingStatus(12, true, "Morgan");

        expect(typingStatus.isTyping).toBeTrue();

    });

    // Test typing status false
    it('should reflect typing status correctly, case: False', () => {
        const typingStatus = new TypingStatus(33, false, "Leon");

        expect(typingStatus.isTyping).toBeFalse();

    });

});

