export class Message {
    constructor(
        public MessageId:number| null,
        public Content:string,
        public UserChatRoomId:number,
        public TimeStamp:string | null,
        public ResourceUrl:string | null,
        public IsDeleted:boolean
    )
    {}
}
