export class ChatListVM {
    constructor( 
        public ChatRoomId: number = 0,
        public UserChatRoomId: number = 0,
        public ProfilePicture: string | null = null,
        public ChatRoomName: string = '',
        public RoomType: boolean | null = null,
        
    ){}
}
