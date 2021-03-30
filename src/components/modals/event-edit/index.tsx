import React, {useCallback, useEffect, useState} from 'react'
import {
    AdditionalText,
    Modal,
    ModalProps,
} from '../../common'
import {
    Button,
    Grid,
    Omit,
    Typography
} from '@material-ui/core'
import {SecondaryButton} from '../../common/buttons'
import {GeneralSection} from './general'
import {storeDiff} from '../user-edit'
import {EventPrizes} from './prizes'
import {Additional} from './additional'
import {Prize, Team} from '../../tools/use-app-state/user'
import {Group, teamsToGroups} from './select-team-popover'
import {getEventTeams, modifyEvent} from '../../../model/api'
import {useAppState} from '../../tools/use-app-state'
import {
    HackathonOptional,
    HackathonSettings
} from '../../tools/use-app-state/hackathon'
import {useSnackbar} from 'notistack'

const _useEventEditModal = () => {
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

export const useEventEdit = () => {
    const {event} = useAppState()

    const [start, setStart] = useState<Date | null>(null)
    const [finish, setFinish] = useState<Date | null>(null)
    const [teamSize, setTeamSize] = useState<string>('')
    const [usersLimit, setUsersLimit] = useState<string>('')
    const [place, setPlace] = useState<string>('')
    const [site, setSite] = useState<string>('')
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        (async () => {
            if (event.isFinished) {
                const teams = await getEventTeams(event.id)
                setGroups(teamsToGroups(teams))
            }
        })()
    }, [event.id, event.isFinished])

    const reset = () => {
        if (event.id !== '-1') {
            setStart(event.settings.start ?? null)
            setFinish(event.settings.finish ?? null)
            setTeamSize(event.settings.teamSize?.toString() ?? '')
            setUsersLimit(event.settings.usersLimit?.toString() ?? '')
            setPlace(event.place)
            setSite(event.settings.site ?? '')
            setPrizes(event.prizes)
            setDisabled(false)
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

    const onPrizesChange = useCallback((p) => {
        setPrizes(p)
    }, [setPrizes])

    const onGroupsChange = useCallback((g) => {
        setGroups(g)
    }, [setGroups])

    return {
        general: {
            start: {
                value: start,
                onChange: onStartChange,
                disabled,
            },
            finish: {
                value: finish,
                onChange: onFinishChange,
                disabled,
            },
            teamSize: {
                value: teamSize,
                onChange: onTeamSizeChange,
                disabled,
            },
            usersLimit: {
                value: usersLimit,
                onChange: onUsersLimitChange,
                disabled,
            }
        },
        additional: {
            place: {
                value: place,
                onChange: onPlaceChange,
                disabled,
            },
            site: {
                value: site,
                onChange: onSiteChange,
                disabled,
            }
        },
        prizes: {
            prizes: {
                value: prizes,
                onChange: onPrizesChange,
                disabled,
            },
            groups: {
                value: groups,
                onChange: onGroupsChange,
                disabled,
            }
        },
        getSubmit: () => {
            const diff = storeDiff(event, {
                place
            })
            diff.settings = {
                start,
                finish,
                teamSize: Number(teamSize),
                usersLimit: Number(usersLimit),
                site
            } as HackathonSettings

            //@ts-ignore
            const teams: (Team&{selected: boolean})[] = groups.reduce((a, g) => [...a, ...g.teams],
                [] as (Team&{selected: boolean})[])

            diff.id = event.id
            return {
                diff: diff as HackathonOptional & { id: string },
                founderId: event.founderId,
                prizes,
                teams: teams,
            }
        },
        onSubmit: async () => {
            const diff = storeDiff(event, {
                place
            })
            diff.settings = {
                start,
                finish,
                teamSize: Number(teamSize),
                usersLimit: Number(usersLimit),
                site
            } as HackathonSettings
            setDisabled(true)

            //@ts-ignore
            const teams: (Team&{selected: boolean})[] = groups.reduce((a, g) => [...a, ...g.teams],
                [] as (Team&{selected: boolean})[])

            diff.id = event.id
            const update = await modifyEvent({
                diff: diff as HackathonOptional & { id: string },
                founderId: event.founderId,
                prizes,
                teams: teams,
            })
            setDisabled(false)
            event.change({
                    ...diff,
                prizes,
            })//@TODO winners
            // const update = await modifyUser(diff as UserOptional & { id: string })
            // setDisabled(false)
            // user.change(diff)
            return update
        },
        onCancel: () => {
            reset()
        },
    }
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const EventEditModalContext = React.createContext()

export const EventEditModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
    const [disabled, setDisabled] = useState(false)

    const {enqueueSnackbar} = useSnackbar()
    const edit = useEventEdit()
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
            <AdditionalText style={{marginTop: 16}}>
                Обозначьте даты проведения мероприятия.
                Ограничьте размер команды, общее число участников
            </AdditionalText>
            <GeneralSection {...edit.general}/>
            <Additional {...edit.additional}/>
            <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
                Призовой фонд
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                Призовой фонд позволит привлечь больше участников
            </AdditionalText>
            <EventPrizes {...edit.prizes}/>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 32}} spacing={1}>
                <Grid item>
                    <Button style={{color: '#818C99'}} disabled={disabled}
                            onClick={(e) => {
                                edit.onCancel()
                                props.close && props.close(e)
                            }}>
                        Отменить
                    </Button>
                </Grid>
                <Grid item>
                    <SecondaryButton disabled={disabled} onClick={async (e) => {
                        const didSave = await edit.onSubmit()
                        if(didSave) {
                            props.close?.(e)
                        } else {
                            enqueueSnackbar('Не удалось обновить данные', {variant: 'error'})
                        }
                    }}>
                        Сохранить
                    </SecondaryButton>
                </Grid>
            </Grid>
        </Grid>
    </Modal>
}

export type UseEventEditModalType = ReturnType<typeof _useEventEditModal>

export const EventEditModalProvider: React.FC = ({children}) => {
    const modalState = _useEventEditModal()
    return <EventEditModalContext.Provider value={modalState}>
        <EventEditModal
            onSubmitClick={modalState.onSubmit}
            open={modalState.isOpen}
            close={modalState.close}/>
        {children}
    </EventEditModalContext.Provider>
}

export const useEventEditModal: () => UseEventEditModalType = () => {
    const context = React.useContext(EventEditModalContext)
    if (context === undefined) {
        throw new Error('useEventEditModal must be used within a EventEditModalProvider')
    }
    return context as UseEventEditModalType
}