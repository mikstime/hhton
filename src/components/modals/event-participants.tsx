import React, {MouseEventHandler, useCallback, useEffect, useState} from 'react'
import {
    AdditionalText,
    Modal,
    ModalProps
} from '../common'
import {
    CircularProgress,
    Grid,
    Omit,
    Typography
} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'
import {Team} from '../tools/use-app-state/user'
import {getEventTeams} from '../../model/api'
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
                                                          user={m}/>) ?? 'Нет участников'
    return <Grid item container direction='column'>
        <Grid item>
            <Typography variant='body1'>{team.name}</Typography>
        </Grid>
        {members}
    </Grid>
}
export const EventParticipantsModal: React.FC<MProps> = ({children, ...props}) => {

    const [teams, setTeams] = useState<Team[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const {cEvent} = useAppState()
    useEffect(() => {
        (async () => {
            if (cEvent.id !== '-1') {
                setTeams([])
                setIsLoading(true)
                const t = await getEventTeams(cEvent.id)
                setIsLoading(false)
                setTeams(t)
            }
        })()
    }, [cEvent.id])
    let r
    if (isLoading) {
        r = <Grid item container justify='center'>
            <CircularProgress color='primary' size='3rem'/></Grid>
    } else if (teams.length > 0) {
        r = teams.map((t, i) => <TeamSection onClick={props.close} team={t}
                                             key={i}/>)
    } else {
        r = <Grid item container justify='center'>
            <AdditionalText>
                Участники отсутствуют
            </AdditionalText>
        </Grid>
    }

    return <Modal
        onClose={props.close}{...props}>
        <Grid container direction='column' spacing={4}>
            <Grid item>
                <Typography variant='h2' style={{fontSize: 22}}>
                    Список участников
                </Typography>
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