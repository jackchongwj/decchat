export class ChatRoomMessages {
    constructor(
        public MessageId:number| null,
        public Content:string,
        public UserChatRoomId:number,
        public TimeStamp:string | null,
        public ResourceUrl:string = '',
        public IsDeleted:boolean,
        public ChatRoomId:number,
        public UserId:number,
        public ProfileName:string = '',
        public ProfilePicture:string = ''
    )
    {}
}
