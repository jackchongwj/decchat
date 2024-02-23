export class GroupMemberList {
    constructor( 
        public ChatRoomId: number = 0,
        public UserId:number = 0,
        public ProfileName: string = '',
        public ProfilePicture: string = '',
        public SelectedUsers: number[],
    ){}
}
