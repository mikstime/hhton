import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {Box, Grid, IconButton} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {AvatarPlate} from '../common'
import {NameTypography} from '../common/typography'
import {ReactComponent as ThumbsUpIcon} from '../../assets/thumbs_up.svg'
import {ReactComponent as ThumbsDownIcon} from '../../assets/thumbs_down.svg'
import {useAppState} from '../tools/use-app-state'
import {useSnackbar} from 'notistack'
import {acceptInvite, declineInvite} from '../../model/api'


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

            const inv = invites.personal.filter(t => t.id !== user.id)
            invites.change({personal: inv})
            setIsFetching(false)


        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось принять заявку`, {
                variant: 'error',
            })
        }
    }, [cUser.id, event.id, user.id, invites, enqueueSnackbar])

    const decline = useCallback(async () => {
        setIsFetching(true)
        const didDecline = await declineInvite(event.id, cUser.id, user.id)
        if (didDecline) {
            setIsFetching(false)
            setFading(false)

            const inv = invites.personal.filter(t => t.id !== user.id)
            invites.change({personal: inv})
            enqueueSnackbar(`Заявка отклонена`, {})
        } else {
            setIsFetching(false)
            enqueueSnackbar(`Не удалось отклонить заявку`, {
                variant: 'error',
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


export const TeamInvitee: React.FC<{ user: User }> = ({user}) => {
    const {isFetching, submit, decline} = useInviteActions(user)

    return <Grid item container spacing={2}>
        <Grid item md={4} xs={9} sm={4}>
            <Link to={`/user/${user.id}`}
                  style={{textDecoration: 'none'}}>
                <AvatarPlate padding={24} src={user.avatar}/>
            </Link>
        </Grid>
        <Box clone order={{xs: 3, sm: 2, md: 2}}>
            <Grid item xs md={6} sm={6} container spacing={2}
                  direction='column'>
                <Grid item container>
                    <NameTypography user={user}/>
                </Grid>
            </Grid>
        </Box>
        <Box clone order={{xs: 2, sm: 3, md: 3}}>
            <Grid item xs={3} sm={2} md={2} container spacing={2}
                  direction='column'
                  justify='center' alignItems='center'>
                <Grid item>
                    <IconButton disabled={isFetching} onClick={submit}>
                        <Box clone width={{xs: '24px', md: '48px'}}
                             height={{xs: '24px', md: '48px'}}>
                            <ThumbsUpIcon/>
                        </Box>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton disabled={isFetching} onClick={decline}>
                        <Box clone width={{xs: '24px', md: '48px'}}
                             height={{xs: '24px', md: '48px'}}>
                            <ThumbsDownIcon/>
                        </Box>
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    </Grid>
}