export class Group {
    constructor(
        public RoomName: string,
        public SelectedUsers: number[],
        public InitiatedBy: number,
        public UserId: number
    ) {}
}
