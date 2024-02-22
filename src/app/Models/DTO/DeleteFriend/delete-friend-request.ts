export class DeleteFriendRequest {
    constructor(
        public ChatRoomId: number,
        public UserId1: number,
        public UserId2: number
    ) {}
}

