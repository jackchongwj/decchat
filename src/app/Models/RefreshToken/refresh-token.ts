export class RefreshToken {
    constructor(
        public TokenId:string,
        public UserId:number,
        public TokenHash:string,
        public ExpiredDateTime:string,
        public IsDeleted:boolean
    )
    {}
}
