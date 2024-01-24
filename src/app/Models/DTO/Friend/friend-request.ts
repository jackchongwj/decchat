export class FriendRequest {
    constructor(
        public ReceivedId: number,
        public SenderId: number,
        public UserName: string | null,
        public Status: number
    ) {}
}

