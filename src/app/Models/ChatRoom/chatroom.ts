export class Chatroom {
    constructor(
        public ChatRoomId:number| null,
        public RoomName:string,
        public CreatedDate:string,
        public RoomType:boolean,
        public RoomProfilePic:string,
        public InitiatedBy:number,
        public IsDeleted:boolean
    )
    {}
}
