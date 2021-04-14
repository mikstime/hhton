import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid, IconButton, Tooltip} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'
import {useAppState} from '../tools/use-app-state'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {useSnackbar} from 'notistack'
import {unInvite} from '../../model/api'
import {ReactComponent as UnBlockIcon} from '../../assets/team/unblock.svg'

const Skills: React.FC<{ user: User }> = ({user}) => {
    const classes = useChipStyles()
    return <div className={classes.root} style={{margin: '0px -8px 0px -8px'}}>
        {user.skills.tags.map((s, i) => <Chip key={s.name + i}
                                              label={s.name}/>)}
    </div>
}


export const TeamDeclined: React.FC<{ user: User }> = ({user}) => {
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
        <Grid item md={5} xs={9} sm={5} style={{
            opacity: 0.7,
            pointerEvents: 'none',
        }}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={24} src={user.avatar} style={{
                    position: 'sticky',
                    top: 24,
                }}/>
            </Link>
        </Grid>
        <Box clone order={{xs: 3, sm: 2, md: 2}}>
            <Grid item xs md={5} sm={5} container spacing={2}
                  direction='column' style={{
                opacity: 0.7,
                pointerEvents: 'none',
            }}>
                <Grid item container>
                    <NameTypography user={user}/>
                </Grid>
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

        </Box>
        <Box clone order={{xs: 2, sm: 3, md: 3}}>
            <Grid item xs={3} sm={2} md={2} container spacing={2}
                  justify='center'>
                <Grid item>
                    <Grid item xs container justify='center'>
                        <Tooltip
                            title={canAccept ? '' : 'Данное действие доступно лидеру команды'}>
                            <div>
                                <IconButton size='small'
                                            disabled={isFetching || !canAccept}
                                            style={{opacity: (isFetching || !canAccept) ? 0.7 : 1}}
                                            onClick={unblock}>
                                    <UnBlockIcon/>
                                </IconButton>
                            </div>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </Grid>
}