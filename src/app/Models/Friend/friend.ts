export class Friend {
    constructor(
        public RequestId:number | null,
        public SenderId:number,
        public ReceiverId:number,
        public Status:number
    )
    {}
}
