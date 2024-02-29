export class ChatListVM {
    constructor( 
        public ChatRoomId: number = 0,
        public ChatRoomName: string = '',
        public ProfileName: string = '',
        public ProfilePicture: string = '',
        public RoomType: boolean | null = null,
        public SelectedUsers: number[],
        public UserChatRoomId: number = 0,
        public UserId:number = 0, 
        public InitiatedBy:number = 0,
        public InitiatorProfileName: string = '',
        public IsOnline: boolean = false,
    ){}
}

