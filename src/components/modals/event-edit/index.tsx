import React, {useCallback, useEffect, useState} from 'react'
import {
    AdditionalText,
    Modal,
    ModalProps
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
import {
    fetchEvent,
    getEventTeams,
    getWinners,
    modifyEvent
} from '../../../model/api'
import {NULL_HACKATHON, useAppState} from '../../tools/use-app-state'
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

    const [description, setDescription] = useState<string>('')
    const [start, setStart] = useState<Date | null>(null)
    const [finish, setFinish] = useState<Date | null>(null)
    const [teamSize, setTeamSize] = useState<string>('')
    const [usersLimit, setUsersLimit] = useState<string>('')
    const [place, setPlace] = useState<string>('')
    const [site, setSite] = useState<string>('')
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [originalWinners, setOriginalWinners] = useState<{}>({})
    const [deletedWinners, setDeletedWinners] = useState<{}>({})
    const [addWinners, setAddWinners] = useState<{}>({})
    const [disabled, setDisabled] = useState(false)
    const [deletedPrizes, setDeletedPrizes] = useState([] as string[])

    useEffect(() => {
        (async () => {
            if (event.isFinished) {
                let teams = await getEventTeams(event.id)
                let newOriginalWinners = {}
                //@ts-ignore
                const winners = (await getWinners(event.id)).sort((w, v) => w.prizes[0].place - v.prizes[0].place)
                for (let w of winners) {
                    if (!w.prizes) {
                        continue
                    }
                    let newPrizesArray = []
                    for (let p of w.prizes) {
                        newPrizesArray.push(p.id ?? '')
                    }
                    // @ts-ignore
                    newOriginalWinners[w.id] = newPrizesArray
                }
                teams = teams.map(t => {
                    const ind = winners.findIndex(v => v.id?.toString() === t.id?.toString())
                    if (~ind) {
                        if (winners[ind]?.prizes?.[0]) {
                            t.prizes = [winners![ind]!.prizes![0]]
                        } else {
                            t.prizes = []
                        }
                    } else {
                        t.prizes = []
                    }
                    return t
                })

                const g = teamsToGroups(teams)
                setOriginalWinners(newOriginalWinners)
                setGroups(g)
            }
        })()
    }, [event.id, event.isFinished, event])

    const reset = () => {
        // if (event.id !== '-1') {
        setDescription(event.description)
        setStart(event.settings.start ?? null)
        setFinish(event.settings.finish ?? null)
        setTeamSize(event.settings.teamSize !== 0 ? event.settings.teamSize?.toString() ?? '' : '')
        setUsersLimit(event.settings.usersLimit?.toString() ?? '')
        setPlace(event.place)
        setSite(event.settings.site ?? '')
        setPrizes(event.prizes)
        setDeletedPrizes([])
        setOriginalWinners(originalWinners)
        setDeletedWinners({})
        setAddWinners({})
        setDisabled(false)
        // }
    }
    const nullReset = () => {
        setDescription('')
        setStart(null)
        setFinish( null)
        setTeamSize('')
        setUsersLimit('')
        setPlace('')
        setSite('')
        setPrizes([])
        setDeletedPrizes([])
        setOriginalWinners({})
        setDeletedWinners({})
        setAddWinners({})
        setDisabled(false)
    }

    useEffect(reset, [event])

    const onDescriptionChange = useCallback((e) => {
        setDescription(e.target.value)
    }, [setUsersLimit])

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

    const onPrizesChange = useCallback((p, d) => {
        setDeletedPrizes(d)
        setPrizes(p)
    }, [setDeletedPrizes, setPrizes])

    const onGroupsChange = useCallback((g, winnersToProcess) => {
        // TODO тут состояние сохраняется
        // console.log('winnersToProcess: ', winnersToProcess)
        // console.log('originalWinners: ', originalWinners)
        const newDeletedWinners = deletedWinners
        const newAddWinners = addWinners
        for (let d of winnersToProcess) {
            // @ts-ignore
            let deletedWinnersArray = newDeletedWinners[d.wID]
            // @ts-ignore
            let addedWinnersArray = newAddWinners[d.wID]
            // @ts-ignore
            const originalWinnersArray = originalWinners[d.wID]
            if (d.upID) {
                if (deletedWinnersArray) {
                    deletedWinnersArray = deletedWinnersArray.filter((p: string) => p !== d.upID)
                }
                if (originalWinnersArray && originalWinnersArray.includes(d.upID)) {
                } else {
                    if (addedWinnersArray) {
                        addedWinnersArray.push(d.upID)
                    } else {
                        addedWinnersArray = [d.upID]
                    }
                }
            } else if (d.dpID) {
                if (originalWinnersArray && originalWinnersArray.includes(d.dpID)) {
                    if (deletedWinnersArray) {
                        deletedWinnersArray.push(d.dpID)
                    } else {
                        deletedWinnersArray = [d.dpID]
                    }
                }
                if (addedWinnersArray) {
                    addedWinnersArray = addedWinnersArray.filter((p: string) => p !== d.dpID)
                }
            }

            if (deletedWinnersArray) {
                // @ts-ignore
                newDeletedWinners[d.wID] = deletedWinnersArray
            }
            if (addedWinnersArray) {
                // @ts-ignore
                newAddWinners[d.wID] = addedWinnersArray
            }
        }
        // console.log('newAddWinners: ', newAddWinners)
        // console.log('newDeletedWinners: ', newDeletedWinners)
        setAddWinners(newAddWinners)
        setDeletedWinners(newDeletedWinners)
        setGroups(g)
    }, [originalWinners, deletedWinners, setDeletedWinners, setGroups])

    return {
        general: {
            description: {
                value: description,
                onChange: onDescriptionChange,
                disabled
            },
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
        },
        prizes: {
            prizes: {
                value: prizes,
                onChange: onPrizesChange,
                disabled
            },
            groups: {
                value: groups,
                onChange: onGroupsChange,
                disabled
            }
        },
        getSubmit: () => {
            const diff = storeDiff(event, {
                place, description
            })
            diff.settings = {
                start,
                finish,
                teamSize: Number(teamSize),
                usersLimit: Number(usersLimit),
                site
            } as HackathonSettings

            //@ts-ignore
            const teams: (Team & { selected: boolean })[] = groups.reduce((a, g) => [...a, ...g.teams],
                [] as (Team & { selected: boolean })[])

            diff.id = event.id
            return {
                diff: diff as HackathonOptional & { id: string },
                founderId: event.founderId,
                prizes,
                teams: teams
            }
        },
        onSubmit: async () => {
            const diff = storeDiff(event, {
                place, description
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
            const teams: (Team & { selected: boolean })[] = groups.reduce((a, g) => [...a, ...g.teams],
                [] as (Team & { selected: boolean })[])

            diff.id = event.id
            const update = await modifyEvent({
                diff: diff as HackathonOptional & { id: string },
                founderId: event.founderId,
                prizes,
                teams: teams,
                addWinners: addWinners,
                deletedWinners: deletedWinners,
                deletedPrizes: deletedPrizes
            })
            setDisabled(false)
            // const update = await modifyUser(diff as UserOptional & { id: string })
            // setDisabled(false)
            // user.change(diff)
            return update
        },
        onCancel: () => {
            reset()
        },
        reset,
        nullReset,
    }
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const EventEditModalContext = React.createContext()

export const EventEditModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
    const [disabled, setDisabled] = useState(false)
    const {event, cEvent} = useAppState()
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
                Призовые места
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                После завершения мероприятия можно распределить призоввые места
                между
                участниками
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
                        const newEvent = await fetchEvent(event.id)
                        if (newEvent) {
                                event.set({...newEvent, isParticipating: event.isParticipating})
                                cEvent.set({...newEvent, isParticipating: cEvent.isParticipating})
                        } else {
                                event.set({
                                    ...NULL_HACKATHON,
                                    id: event.id,
                                    notFound: true
                                })
                                cEvent.set({
                                    ...NULL_HACKATHON,
                                    id: event.id,
                                    notFound: true
                                })
                        }
                        props.close?.(e)
                        if (!didSave) {
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