export class UserProfileUpdate {
    constructor( 
        public UserId: number = 0,
        public ProfileName: string = '',
        public ProfilePicture: string = '',
    ){}
}
