export class Messages {
    constructor(
        public MessageId:number| null,
        public Content:string,
        public UserChatRoomId:number,
        public TimeStamp:string | null,
        public ResourceUrl:string | null,
        public MessageType:number,
        public IsDeleted:boolean,
        public ChatRoomId:number,
        public UserId:number
    )
    {}
}
