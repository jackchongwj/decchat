export class UserSearchDetails {
    constructor(
        public UserId: number,
        public UserName: string,
        public ProfileName: string,
        public Password: string,
        public ProfilePicture: string,
        public Status: number,
        public IsDelete:number
    ) {}
}
