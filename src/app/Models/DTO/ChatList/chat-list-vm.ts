export class ChatListVM {
    constructor( 
        public ProfileName: string,
        public ProfilePicture: string,
        public RoomName: string,
        public RoomProfilePic: string,
        public RoomType: boolean | null,
        public ChatRoomId: number
    ){}
}
