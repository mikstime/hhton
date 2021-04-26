import React, {MouseEventHandler, useCallback, useEffect, useState} from 'react'
import {
    AdditionalText,
    Modal,
    ModalProps
} from '../common'
import {
    Chip,
    CircularProgress, createStyles,
    Grid, makeStyles,
    Omit, Theme,
    Typography
} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'
import {Team, User} from '../tools/use-app-state/user'
import {getEventTeams, getEventUsers} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {TeamItem} from '../user/team-description'

const _useEventParticipantsModal = () => {
    const [isOpen, setIsOpen] = useState(false)

    const open = useCallback(() => {
        setIsOpen(true)
    }, [setIsOpen])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    return {
        open,
        close,
        isOpen
    }
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const EventParticipantsModalContext = React.createContext()

const TeamSection: React.FC<{ team: Team, onClick?: MouseEventHandler }> = ({team, onClick}) => {
    const members = team.members?.map((m, i) => <TeamItem key={i}
                                                          onClick={onClick}
                                                          user={m}/>) ?? 'Нет членов команды'
    return <Grid item container direction='column'>
        <Grid item>
            <Typography variant='body1'>{team.name}</Typography>
        </Grid>
        {members}
    </Grid>
}

const UsersSection: React.FC<{ users: User[], onClick?: MouseEventHandler }> = ({users, onClick}) => {
    const members = users.map((m, i) => <TeamItem key={i}
                                                  onClick={onClick}
                                                  user={m}/>) ?? null
    return <Grid item container direction='column'>
        {members}
    </Grid>
}

const useChipStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            minHeight: 48,
            marginLeft: 16,
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                borderRadius: 8,
                background: 'white',
                boxShadow: theme.shadows[4],
                color: theme.palette.primary.main,
                cursor: 'pointer',
                '&:hover': {
                    background: 'white'
                },
                '&:active': {
                    background: '#F7F8FA',
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

export const EventParticipantsModal: React.FC<MProps> = ({children, ...props}) => {

    const [teams, setTeams] = useState<Team[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const {cEvent} = useAppState()
    const classes = useChipStyles()
    const [showTeams, setShowTeams] = useState(false)

    useEffect(() => {
        (async () => {
            if(!props.open || !showTeams) return

            if (cEvent.id !== '-1') {
                // setTeams([])
                setIsLoading(true)
                const t = await getEventTeams(cEvent.id)
                setIsLoading(false)
                setTeams(t)
            }
        })()
    }, [props.open, showTeams])

    useEffect(() => {
        (async () => {
            if(!props.open || showTeams) return

            if (cEvent.id !== '-1') {
                // setUsers([])
                setIsLoading(true)
                const u = await getEventUsers(cEvent.id)
                setIsLoading(false)
                setUsers(u)
            }
        })()
    }, [props.open])

    let r
    if (isLoading) {
        r = <Grid item container justify='center'>
            <CircularProgress color='primary' size='3rem'/></Grid>
    } else if (showTeams) {
        if (teams.length > 0) {
            r = teams.map((t, i) => <TeamSection onClick={props.close} team={t}
                                                 key={i}/>)
        } else {
            r = <Grid item container justify='center'>
                <AdditionalText>
                    Команды отсутствуют
                </AdditionalText>
            </Grid>
        }
    } else {
        if (users.length > 0) {
            r = <UsersSection onClick={props.close} users={users}/>
        } else {
            r = <Grid item container justify='center'>
                <AdditionalText>
                    Участники отсутствуют
                </AdditionalText>
            </Grid>
        }
    }

    return <Modal
        onClose={props.close}{...props}>
        <Grid container direction='column' spacing={4}>
            <Grid item container wrap='nowrap' alignItems='center'>
                <Grid item>
                    <Typography variant='h2' style={{fontSize: 22}}>
                        Список
                    </Typography>
                </Grid>
                <Grid item xs className={classes.root}>
                    <Chip
                        onClick={() => {
                            setShowTeams(false)
                        }}
                        className={showTeams ? '' : classes.selected}
                        label='участников'
                    />
                    <Chip
                        onClick={() => {
                            setShowTeams(true)
                        }}
                        className={showTeams ? classes.selected : ''}
                        label='команд'
                    />
                </Grid>
            </Grid>
            <Grid item container direction='column' spacing={3}>
                {r}
            </Grid>
            <Grid item container justify='flex-end'>
                <PrimaryButton onClick={props.close}>Понятно</PrimaryButton>
            </Grid>
        </Grid>
    </Modal>
}

export type UseEventParticipantsModalType = ReturnType<typeof _useEventParticipantsModal>

export const EventParticipantsModalProvider: React.FC = ({children}) => {
    const modalState = _useEventParticipantsModal()
    return <EventParticipantsModalContext.Provider value={modalState}>
        <EventParticipantsModal
            open={modalState.isOpen}
            close={modalState.close}/>
        {children}
    </EventParticipantsModalContext.Provider>
}

export const useEventParticipantsModal: () => UseEventParticipantsModalType = () => {
    const context = React.useContext(EventParticipantsModalContext)
    if (context === undefined) {
        throw new Error('useEventParticipantsModal must be used within a EventParticipantsModalProvider')
    }
    return context as UseEventParticipantsModalType
}