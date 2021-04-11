import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Chip, Grid, IconButton} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
// import {ReactComponent as ThumbsUpIcon} from '../../assets/thumbs_up.svg'
// import {ReactComponent as ThumbsDownIcon} from '../../assets/thumbs_down.svg'
import {useAppState} from '../tools/use-app-state'
import {useSnackbar} from 'notistack'
import {unInvite} from '../../model/api'
import {useChipStyles} from './team-member'
import {SocialLink} from '../app/user'
import {ReactComponent as KickIcon} from '../../assets/team/kick.svg'

const useInviteActions = (user: User) => {
    const [isFetching, setIsFetching] = useState(false)
    const [fading, setFading] = useState(true)
    const {cEvent, cUser, invites} = useAppState()

    const {enqueueSnackbar} = useSnackbar()

    const decline = useCallback(async () => {
        setIsFetching(true)
        const didDecline = await unInvite(cEvent.id, cUser.id, user.id)
        if (didDecline) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.o.personal.filter(t => t.id !== user.id)
            invites.o.change({personal: inv})
            enqueueSnackbar(`Заявка отменена`, {})
        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось отменить заявку`, {
                variant: 'error',
            })
        }
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar])
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


export const TeamInvited: React.FC<{ user: User }> = ({user}) => {
    const {isFetching, decline} = useInviteActions(user)

    return <Grid item container spacing={2}>
        <Grid item md={5} xs={9} sm={5}>
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
                  direction='column'>
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
                  direction='column'
                  justify='center' alignItems='center'>
                <Grid item>
                    <IconButton disabled={isFetching} onClick={decline}>
                        <Box clone width={{xs: '24px', md: '48px'}}
                             height={{xs: '24px', md: '48px'}}>
                            <KickIcon/>
                        </Box>
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    </Grid>
}