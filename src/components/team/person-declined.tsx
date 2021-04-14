import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid, IconButton, Tooltip} from '@material-ui/core'
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {TeamDescription} from '../user/team-description'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'
import {ReactComponent as UnBlockIcon} from '../../assets/team/unblock.svg'
import {useAppState} from '../tools/use-app-state'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {useSnackbar} from 'notistack'
import {unInvite} from '../../model/api'


const Skills: React.FC<{ user: User }> = ({user}) => {
    const classes = useChipStyles()
    return <div className={classes.root} style={{margin: '0px -8px 0px -8px'}}>
        {user.skills.tags.map((s, i) => <Chip key={s.name + i}
                                              label={s.name}/>)}
    </div>
}


export const PersonDeclined: React.FC<{ user: User }> = ({user}) => {
    const [isFetching, setIsFetching] = useState(false)
    const {cEvent, cUser} = useAppState()
    const nc = useNotificationHandlers()
    const {enqueueSnackbar} = useSnackbar()

    const unblock = useCallback(async () => {
        setIsFetching(true)
        const didUnBan = await unInvite(cEvent.id, cUser.id, user.id)
        if (didUnBan) {
            setIsFetching(false)
        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось разблокировать заявку`, {
                variant: 'error'
            })
        }
        nc.update()
    }, [cUser.id, cEvent.id, user.id, enqueueSnackbar, nc.update])

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item container spacing={2}>
        <Grid item container md={8} xs={12} sm={12} style={{
            overflow: 'visible',
            opacity: 0.7, pointerEvents: 'none'
        }}>
            <AvatarPlate direction='row' src={user.avatar}
                         avatarProps={{wrap: 'nowrap', xs: 12, sm: 6, md: 7}}>
                <Grid xs sm={6} md={5} item container
                      direction='column'>
                    <Box paddingLeft={{xs: 0, sm: 2}}
                         marginTop={{xs: 1, md: 0}}>
                        <Grid item container>
                            <NameTypography user={user}/>
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
                                            onClick={unblock}
                                            style={{opacity: (isFetching || !canAccept) ? 0.7 : 1}}
                                            disabled={isFetching || !canAccept}>
                                    <UnBlockIcon/>
                                </IconButton>
                            </Box>
                        </div>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item>
                <Skills user={user}/>
            </Grid>
            <Grid item container style={{
                marginTop: 24, marginBottom: 24,
                opacity: 0.7,
                pointerEvents: 'none'
            }}
                  wrap='nowrap'>
                <Grid item container direction='column' justify='center'
                      spacing={2}>
                    <SocialLink prefix='ВКонтакте: ' site='vk.com/'
                                value={user.settings.vk || '1234'}/>
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