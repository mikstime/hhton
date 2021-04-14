import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid, IconButton, Tooltip} from '@material-ui/core'
import {AvatarPlate} from '../common'
import {PrimaryButton} from '../common/buttons'
import {InviteButton} from '../event/invite-button'
import {NameTypography} from '../common/typography'
import {TeamDescription} from '../user/team-description'
import {acceptInvite, banInvite, declineInvite} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {useSnackbar} from 'notistack'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {ReactComponent as BlockIcon} from '../../assets/team/block.svg'
import {ReactComponent as UnBlockIcon} from '../../assets/team/unblock.svg'

const useInviteActions = (user: User) => {
    const [isFetching, setIsFetching] = useState(false)
    const [fading, setFading] = useState(true)
    const {cEvent, cUser, invites} = useAppState()
    const nc = useNotificationHandlers()

    const {enqueueSnackbar} = useSnackbar()

    const block = useCallback(async () => {
        setIsFetching(true)
        const didBlock = await banInvite(cEvent.id, cUser.id, user.id)
        if (didBlock) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.i.team.filter(t => t.id !== user.id)
            invites.i.change({team: inv})
            setIsFetching(false)
            enqueueSnackbar(`Заявка заблокирована`)
        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось заблокироавть заявку`, {
                variant: 'error'
            })
        }
        nc.update()
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar, nc.update])

    const submit = useCallback(async () => {
        setIsFetching(true)
        const didAccept = await acceptInvite(cEvent.id, cUser.id, user.id)
        if (didAccept) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.i.team.filter(t => t.id !== user.id)
            invites.i.change({team: inv})
            setIsFetching(false)

        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось принять заявку`, {
                variant: 'error'
            })
        }
        nc.update()
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar, nc.update])

    const decline = useCallback(async () => {
        setIsFetching(true)
        const didDecline = await declineInvite(cEvent.id, cUser.id, user.id)
        if (didDecline) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.i.team.filter(t => t.id !== user.id)
            invites.i.change({team: inv})
            enqueueSnackbar(`Заявка отклонена`, {})
        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось отклонить заявку`, {
                variant: 'error'
            })
        }
        nc.update()
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar, nc.update])
    return {
        isFetching,
        fading,
        submit,
        block,
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

    const {cUser} = useAppState()
    const {isFetching, submit, decline, block} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead
    return <Grid item container spacing={2}
                 style={{overflow: 'visible'}}>
        <Grid item container md={8} xs={12} sm={12}>
            <AvatarPlate direction='row' src={user.avatar}
                         afterChildren={
                             <Box clone paddingTop={2} flex='1'>
                                 <Grid container item xs={12}>
                                     <Tooltip
                                         title={canAccept ? '' : 'Данное действие доступно лидеру команды'}>
                                         <Grid container item xs={12} sm={6}
                                               md={7}>
                                             <PrimaryButton onClick={submit}
                                                            disabled={isFetching || !canAccept}
                                                            style={{flex: 1}}>
                                                 Объединиться
                                             </PrimaryButton>
                                         </Grid>
                                     </Tooltip>
                                     <Box clone paddingLeft={2}>
                                         <Tooltip
                                             title={canAccept ? '' : 'Данное действие доступно лидеру команды'}>
                                             <Grid container item xs={12} sm={6}
                                                   md={5}
                                                   justify='center'>
                                                 <InviteButton
                                                     onClick={decline}
                                                     disabled={isFetching || !canAccept}>
                                                     Отклонить
                                                 </InviteButton>
                                             </Grid>
                                         </Tooltip>
                                     </Box>
                                 </Grid>
                             </Box>}
                         avatarProps={{wrap: 'nowrap', xs: 12, sm: 6, md: 7}}>
                <Grid xs sm={6} md={5} item container
                      direction='column'>
                    <Box paddingLeft={{xs: 0, sm: 2}}
                         marginTop={{xs: 1, md: 0}}>
                        <Grid item container>
                            <Grid item>
                                <NameTypography user={user}/>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box paddingLeft={{xs: 0, sm: 2}}>
                        <TeamDescription noName user={user}/>
                    </Box>
                </Grid>
            </AvatarPlate>
        </Grid>
        <Grid item container md={3} xs={12} sm={12}>
            <Grid item container justify='flex-end'>

                <Grid item>
                    <Tooltip
                        title={canAccept ? '' : 'Данное действие доступно лидеру команды'}>
                        <div>
                            <Box clone marginTop='-4px'>
                                <IconButton size='small'
                                            onClick={block}
                                            disabled={isFetching || !canAccept}>
                                    <BlockIcon/>
                                </IconButton>
                            </Box>
                        </div>
                    </Tooltip>
                </Grid>
            </Grid>
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
            <Grid item container/>
        </Grid>
    </Grid>
}