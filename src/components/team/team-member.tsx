import React, {useCallback, useState} from 'react'
import {User} from '../tools/use-app-state/user'
import {
    Chip,
    createStyles,
    Grid, GridProps,
    IconButton,
    makeStyles,
    Theme
} from '@material-ui/core'
import {ReactComponent as KickActiveIcon} from '../../assets/team/kick_active.svg'
import {ReactComponent as KickIconBase} from '../../assets/team/kick.svg'
import {ReactComponent as VoteActiveIcon} from '../../assets/team/vote_active.svg'
import {ReactComponent as VoteIconBase} from '../../assets/team/vote.svg'
import {useAppState} from '../tools/use-app-state'
import {kickTeamMember, unVoteFor, voteFor} from '../../model/api'
import {useSnackbar} from 'notistack'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {usePromptModal} from '../modals/prompt'
import {PersonPlate} from './person-plate'


const KickIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <KickActiveIcon {...props}/> : <KickIconBase {...props}/>
}

export const useChipStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: '16px -16px 16px -16px',
            '& > *': {
                margin: theme.spacing(1),
                borderRadius: 8,
                background: 'white',
                boxShadow: theme.shadows[4],
                color: theme.typography.body2.color,
                '&:hover': {
                    background: 'white'
                },
                '&:active': {
                    background: 'white',
                    boxShadow: 'none'
                },
                '&:focus': {
                    background: 'white'
                }
            }
        },
        selected: {
            background: '#F7F8FA',
            boxShadow: 'none',
            '&:hover': {
                background: '#F7F8FA',
                boxShadow: 'none'
            },
            '&:focus': {
                background: '#F7F8FA',
                boxShadow: 'none'
            },
            '&:active': {
                background: '#F7F8FA',
                boxShadow: 'none'
            }
        },
        notSelected: {
            opacity: 0.3,
            '&:hover': {
                background: 'white'
            },
            '&:active': {
                background: '#F7F8FA'
            }
        }
    })
)


export const TeamMember: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const {cUser, cEvent} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    const pModal = usePromptModal()
    const [isKicking, setIsKicking] = useState(false)
    const isFetching = isKicking

    const onKick = useCallback(async () => {
        setIsKicking(true)
        const didKick = await kickTeamMember(cEvent.id, cUser.team.id ?? '-1', user.id)
        if (didKick) {
            enqueueSnackbar('Пользователь исключен')
        } else {
            enqueueSnackbar('Не удалось исключить из команды', {
                variant: 'error'
            })
        }
        setIsKicking(false)
        nc.update()

    }, [enqueueSnackbar, cEvent.id, cUser.team.id, user.id, nc.update])

    const onKickClick = useCallback(() => {
        pModal.open({
            onSubmit: async () => {
                await onKick()
                pModal.close()
            },
            message: `Исключить пользователя из команды?`,
            accept: 'Исключить',
            decline: 'Оставить'
        })
    }, [pModal.open, onKick])

    return <Grid item xs container {...props}><PersonPlate user={user} topElements={
        <IconButton disabled={isFetching}
                    size='small'
                    onClick={onKickClick}>
            <KickIcon active={false}/>
        </IconButton>}/>
    </Grid>
}