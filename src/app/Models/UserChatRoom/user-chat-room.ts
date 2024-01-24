export class UserChatRoom {
    constructor(
        public UserChatRoomId:number| null,
        public UserId:number,
        public ChatRoomId:number,
        public IsDeleted:boolean
    )
    {}
}
