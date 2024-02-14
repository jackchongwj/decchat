export class ChatListVM {
    constructor( 
        public ChatRoomId: number = 0,
        public ChatRoomName: string = '',
        public ProfileName: string = '',
        public ProfilePicture: string | null = null,
        public RoomType: boolean | null = null,
        public SelectedUsers: number[],
        public UserChatRoomId: number = 0,
        public UserId:number = 0
        
    ){}
}

