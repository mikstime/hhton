import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid, Tooltip} from '@material-ui/core'
import {AvatarPlate} from '../common'
import {InviteButton} from '../event/invite-button'
import {NameTypography} from '../common/typography'
import {TeamDescription} from '../user/team-description'
import {unInvite} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {useSnackbar} from 'notistack'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'
import {useNotificationHandlers} from '../tools/notification-handlers'

const useInviteActions = (user: User) => {
    const [isFetching, setIsFetching] = useState(false)
    const [fading, setFading] = useState(true)
    const {cEvent, cUser, invites} = useAppState()
    const nc = useNotificationHandlers()
    const {enqueueSnackbar} = useSnackbar()

    const decline = useCallback(async () => {
        setIsFetching(true)
        const didDecline = await unInvite(cEvent.id, cUser.id, user.id)
        if (didDecline) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.o.team.filter(t => t.id !== user.id)
            invites.o.change({team: inv})
            enqueueSnackbar(`Заявка отменена`, {})
        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось отменить заявку`, {
                variant: 'error'
            })
        }
        nc.update()
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar, nc.update])
    return {
        isFetching,
        fading,
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


export const PersonInvited: React.FC<{ user: User }> = ({user}) => {

    const {isFetching, decline} = useInviteActions(user)
    const {cUser} = useAppState()
    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item container spacing={2}
                 style={{overflow: 'visible'}}>
        <Grid item container xs={12}>
            <AvatarPlate direction='row' src={user.avatar}
                         afterChildren={
                             <Box clone paddingTop={2} flex='1'>
                                 <Grid container item xs={12}>
                                     <Grid container item xs={12}>
                                     </Grid>
                                     <Box clone paddingLeft={2}>
                                         <Grid container item xs={12}
                                               justify='center'>
                                             <Tooltip
                                                 title={canAccept ? '' : 'Данное действие доступно лидеру команды'}>
                                                 <div>
                                                     <InviteButton
                                                         onClick={decline}
                                                         disabled={isFetching || !canAccept}>
                                                         Отменить
                                                     </InviteButton>
                                                 </div>
                                             </Tooltip>
                                         </Grid>
                                     </Box>
                                 </Grid>
                             </Box>}
                         avatarProps={{wrap: 'nowrap', xs: 12}}>
                <Grid xs sm={6} md={5} item container
                      direction='column'>
                    <Box paddingLeft={{xs: 0}}
                         marginTop={{xs: 1}}>
                        <Grid item container>
                            <NameTypography user={user}/>
                        </Grid>
                    </Box>
                    <Box paddingLeft={{xs: 0}}>
                        <TeamDescription noName user={user}/>
                    </Box>
                </Grid>
            </AvatarPlate>
        </Grid>
        <Grid item container xs={12}>
            <Grid item>
                <Skills user={user}/>
            </Grid>
            <Grid item container style={{marginTop: 24, marginBottom: 24}}
                  wrap='nowrap'>
                <Grid item container direction='column' justify='center'
                      spacing={2}>
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