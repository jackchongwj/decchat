export class EditMessage {
    constructor(
        public MessageId:number| null,
        public Content:string,
        public ChatRoomId:number,
    )
    {}
}
