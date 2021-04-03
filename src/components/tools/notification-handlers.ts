
export const notificationHandlers: () => {
    a: number,
    newTeamNotification: () => void,
    newMembersNotification: () => void,
    newInviteNotification: () => void,
    newDenyNotification: () => void,
    default: () => void
} = () => {
    return {
        a: 1,
        newTeamNotification: () => {},
        newMembersNotification: () => {},
        newInviteNotification: () => {},
        newDenyNotification: () => {},
        default: () => {}
    }
}