export class User {
    constructor(
        public UserId:number| null,
        public UserName:string,
        public ProfileName:string,
        public HashedPassword: string,
        public ProfilePicture:string,
        public Salt:string,
        public IsDeleted:boolean
    )
    {}
}
