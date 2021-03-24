import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid} from '@material-ui/core'
import {AvatarPlate} from '../common'
import {PrimaryButton} from '../common/buttons'
import {InviteButton} from '../event/invite-button'
import {NameTypography} from '../common/typography'
import {TeamDescription} from '../user/team-description'
import {acceptInvite, declineInvite} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {useSnackbar} from 'notistack'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'

const useInviteActions = (user: User) => {
    const [isFetching, setIsFetching] = useState(false)
    const [fading, setFading] = useState(true)
    const {cEvent, cUser, invites} = useAppState()

    const {enqueueSnackbar} = useSnackbar()

    const submit = useCallback(async () => {
        setIsFetching(true)
        const didAccept = await acceptInvite(cEvent.id, cUser.id, user.id)
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
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar])

    const decline = useCallback(async () => {
        setIsFetching(true)
        const didDecline = await declineInvite(cEvent.id, cUser.id, user.id)
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
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar])
    return {
        isFetching,
        fading,
        submit,
        decline
    }
}


const Skills: React.FC<{ user: User }> = ({user}) => {
    const classes = useChipStyles()
    return <div className={classes.root} style={{margin: '0px -8px 0px -8px'}}>
        {user.skills.tags.map((s, i) => <Chip key={s.name + i}
                                              label={s.name}/>)}
    </div>
}


export const PersonInvitee: React.FC<{ user: User }> = ({user}) => {

    const {isFetching, submit, decline} = useInviteActions(user)
    return <Grid item container spacing={2}
                 style={{overflow: 'visible'}}>
        <Grid item container md={8} xs={12} sm={12}>
            <AvatarPlate direction='row' src={user.avatar}
                         afterChildren={
                             <Box clone paddingTop={2} flex='1'>
                                 <Grid container item xs={12}>
                                         <Grid container item xs={12} sm={6} md={7}>
                                             <PrimaryButton onClick={submit}
                                                            disabled={isFetching}
                                                            style={{flex: 1}}>
                                                 Объединиться
                                             </PrimaryButton>
                                         </Grid>
                                     <Box clone paddingLeft={2}>
                                     <Grid container item xs={12} sm={6} md={5}
                                           justify='center'>
                                         <InviteButton onClick={decline}
                                                       disabled={isFetching}>
                                             Отклонить
                                         </InviteButton>
                                     </Grid>
                                     </Box>
                                 </Grid>
                             </Box>}
                         avatarProps={{wrap: 'nowrap', xs: 12, sm: 6, md: 7}}>
                <Grid xs sm={6} md={5} item container
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
        <Grid item container md={4} xs={12} sm={6}>
            <Grid item>
                <Skills user={user}/>
            </Grid>
            <Grid item container style={{marginTop: 24, marginBottom: 24}} wrap='nowrap'>
                <Grid item container direction='column' justify='center' spacing={2}>
                    <SocialLink prefix='ВКонтакте: ' site='vk.com/'
                                value={user.settings.vk}/>
                    <SocialLink prefix='Телеграм: ' site='t.me/'
                                value={user.settings.tg}/>
                    <SocialLink prefix='Github: ' site='github.com/'
                                value={user.settings.gh}/>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}