import React, {useCallback, useEffect, useState} from 'react'
import {
    Modal,
    ModalProps,
} from '../common'
import {
    Grid,
    Omit,
    Typography
} from '@material-ui/core'
import {GeneralSection} from './event-edit/general'
import {WhiteFieldLabel} from './user-edit'
import {Additional} from './event-edit/additional'
import {useAppState} from '../tools/use-app-state'
import {PrimaryButton} from '../common/buttons'

const _useEventAboutModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [onSubmit, setOnSubmit] = useState<Function | undefined>(undefined)

    const open = useCallback(({onSubmit}) => {
        setOnSubmit(() => onSubmit)
        setIsOpen(true)
    }, [setIsOpen, setOnSubmit])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    return {
        open,
        close,
        isOpen,
        onSubmit: () => onSubmit && onSubmit()
    }
}

const useEventAbout = () => {
    const {event} = useAppState()

    const [start, setStart] = useState<Date | null>(null)
    const [finish, setFinish] = useState<Date | null>(null)
    const [teamSize, setTeamSize] = useState<string>('')
    const [usersLimit, setUsersLimit] = useState<string>('')
    const [place, setPlace] = useState<string>('')
    const [site, setSite] = useState<string>('')
    const [disabled, setDisabled] = useState(true)

    const reset = () => {
        if (event.id !== '-1') {
            setStart(event.settings.start ?? null)
            setFinish(event.settings.finish ?? null)
            setTeamSize(event.settings.teamSize?.toString() ?? '')
            setUsersLimit(event.settings.usersLimit?.toString() ?? '')
            setPlace(event.place)
            setSite(event.settings.site ?? '')
            setDisabled(true)
        }
    }

    useEffect(reset, [event.id])

    const onStartChange = useCallback((d: Date) => {
        setStart(d)
    }, [setStart])

    const onFinishChange = useCallback((d: Date) => {
        setFinish(d)
    }, [setFinish])

    const onTeamSizeChange = useCallback((e) => {
        setTeamSize(e.target.value)
    }, [setTeamSize])

    const onUsersLimitChange = useCallback((e) => {
        setUsersLimit(e.target.value)
    }, [setUsersLimit])

    const onPlaceChange = useCallback((e) => {
        setPlace(e.target.value)
    }, [setPlace])

    const onSiteChange = useCallback((e) => {
        setSite(e.target.value)
    }, [setSite])

    return {
        general: {
            start: {
                value: start,
                onChange: onStartChange,
                disabled
            },
            finish: {
                value: finish,
                onChange: onFinishChange,
                disabled
            },
            teamSize: {
                value: teamSize,
                onChange: onTeamSizeChange,
                disabled
            },
            usersLimit: {
                value: usersLimit,
                onChange: onUsersLimitChange,
                disabled
            }
        },
        additional: {
            place: {
                value: place,
                onChange: onPlaceChange,
                disabled
            },
            site: {
                value: site,
                onChange: onSiteChange,
                disabled
            }
        }
    }
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const EventAboutModalContext = React.createContext()

export const EventAboutModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
    const [disabled, setDisabled] = useState(false)

    const edit = useEventAbout()
    useEffect(() => {
        if (disabled) {
            onSubmitClick()
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled])
    useEffect(() => {
        if (props.open) {
            setDisabled(false)
        }
    }, [props.open])
    return <Modal
        onClose={props.close}{...props}>
        <Grid container direction='column'>
            <Typography variant='h2' style={{fontSize: 22}}>
                Информация о мероприятии
            </Typography>
            <GeneralSection {...edit.general}/>
            <WhiteFieldLabel label='Место проведения'/>
            <Additional {...edit.additional}/>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 32}} spacing={1}>
                <Grid item>
                    <PrimaryButton onClick={props.close}>
                        Понятно
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    </Modal>
}

export type UseEventAboutModalType = ReturnType<typeof _useEventAboutModal>

export const EventAboutModalProvider: React.FC = ({children}) => {
    const modalState = _useEventAboutModal()
    return <EventAboutModalContext.Provider value={modalState}>
        <EventAboutModal
            onSubmitClick={modalState.onSubmit}
            open={modalState.isOpen}
            close={modalState.close}/>
        {children}
    </EventAboutModalContext.Provider>
}

export const useEventAboutModal: () => UseEventAboutModalType = () => {
    const context = React.useContext(EventAboutModalContext)
    if (context === undefined) {
        throw new Error('useEventAboutModal must be used within a EventAboutModalProvider')
    }
    return context as UseEventAboutModalType
}