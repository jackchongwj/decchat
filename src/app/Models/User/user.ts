export class User {
    constructor(
        public UserId:number| null,
        public UserName:string,
        public ProfileName:string,
        public Password: string,
        public ProfilePicture:string,
        public IsDeleted:boolean
    )
    {}
}
