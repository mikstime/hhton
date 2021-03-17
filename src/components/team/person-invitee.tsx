import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Grid} from '@material-ui/core'
import {AvatarPlate} from '../common'
import {PrimaryButton} from '../common/buttons'
import {InviteButton} from '../event/invite-button'
import {NameTypography} from '../common/typography'
import {TeamDescription} from '../user/team-description'
import {acceptInvite, declineInvite} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {useSnackbar} from 'notistack'

const useInviteActions = (user: User) => {
    const [isFetching, setIsFetching] = useState(false)
    const [fading, setFading] = useState(true)
    const {event, cUser, invites} = useAppState()

    const {enqueueSnackbar} = useSnackbar()

    const submit = useCallback(async () => {
        setIsFetching(true)
        const didAccept = await acceptInvite(event.id, cUser.id, user.id)
        if (didAccept) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.team.filter(t => t.id !== user.id)
            invites.change({team: inv})
            setIsFetching(false)


        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось принять заявку`, {
                variant: 'error'
            })
        }
    }, [cUser.id, event.id, user.id, invites, enqueueSnackbar])

    const decline = useCallback(async () => {
        setIsFetching(true)
        const didDecline = await declineInvite(event.id, cUser.id, user.id)
        if (didDecline) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.team.filter(t => t.id !== user.id)
            invites.change({team: inv})
            enqueueSnackbar(`Заявка отклонена`, {})
        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось отклонить заявку`, {
                variant: 'error'
            })
        }
    }, [cUser.id, event.id, user.id, invites, enqueueSnackbar])
    return {
        isFetching,
        fading,
        submit,
        decline
    }
}


export const PersonInvitee: React.FC<{ user: User }> = ({user}) => {

    const {isFetching, submit, decline} = useInviteActions(user)
    return <Grid item container spacing={2}
                 style={{overflow: 'visible'}}>
        <Grid item container md={8} xs={9} sm={8}>
            <AvatarPlate direction='row' src={user.avatar}
                         afterChildren={
                             <Box clone paddingTop={2} flex='1'>
                                 <Grid container item xs={12}>
                                         <Grid container item xs={12} sm={7}>
                                             <PrimaryButton onClick={submit}
                                                            disabled={isFetching}
                                                            style={{flex: 1}}>
                                                 Объединиться
                                             </PrimaryButton>
                                         </Grid>
                                     <Box clone paddingLeft={2}>
                                     <Grid container item xs={12} sm={5}
                                           justify='center'>
                                         <InviteButton onClick={decline}
                                                       disabled={isFetching}>
                                             Отклонить
                                         </InviteButton>
                                     </Grid>
                                     </Box>
                                 </Grid>
                             </Box>}
                         avatarProps={{wrap: 'nowrap', xs: 12, sm: 7}}>
                <Grid xs sm={4} item container
                      direction='column'>
                    <Box paddingLeft={2}>
                        <Grid item container>
                            <NameTypography user={user}/>
                        </Grid>
                    </Box>
                    <Box paddingLeft={2}>
                        <TeamDescription noName user={user}/>
                    </Box>
                </Grid>
            </AvatarPlate>
        </Grid>
        <Grid item container md={6} xs={12} sm={6}>
        </Grid>
    </Grid>
}