export class Message {
    constructor(
        public MessageId:number,
        public Content:string,
        public UserChatRoomId:number,
        public TimeStamp:string,
        public ResourceUrl:string,
        public MessageType:number,
        public IsDeleted:boolean
    )
    {}
}
