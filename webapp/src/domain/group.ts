export interface Group {
    groupId: number
    roomName: string,
    isCompleted: boolean,
    members: [{
        userId: string,
        displayName: string,
        avatarUrl: string
    }]
}