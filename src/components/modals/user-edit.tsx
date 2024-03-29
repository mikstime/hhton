import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
    AdditionalText,
    FlexSpace,
    GrayPlate,
    Modal,
    ModalProps,
    Plate
} from '../common'
import {
    Box,
    Button, Chip,
    Grid, GridProps, Hidden,
    InputBase,
    InputBaseProps,
    Omit,
    Typography, Zoom
} from '@material-ui/core'
import {SecondaryButton} from '../common/buttons'
import {useChipStyles} from '../common/skill-chip'
import {getJobs, getSkills, modifyUser} from '../../model/api'
import {NULL_USER, UserOptional, UserSkill} from '../tools/use-app-state/user'
import {useAppState} from '../tools/use-app-state'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {ChosenSkills} from '../common/display-skills'

const _useUserEditModal = () => {
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

export const storeDiff = (o1: { [key: string]: any }, o2: { [key: string]: any }) => {
    const toReturn: { [key: string]: any } = {}
    for (let key of Object.keys(o2)) {
        if (o2[key] !== o1[key]) {
            toReturn[key] = o2[key]
        }
    }
    return toReturn
}
const MultilineGrayField: React.FC<{ label: string, inputProps?: InputBaseProps } & GridProps> = ({label, inputProps = {}, ...rest}) => {
    const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
    const onClick = useCallback(() => {
        fieldRef.current?.focus()
    }, [fieldRef.current])
    return <Grid onClick={onClick} item xs container
                 alignItems='baseline' {...rest}>
        <Box clone width={{sm: '100px'}} paddingRight={2}>
            <Grid xs={12} sm='auto' item>
                <Box clone textAlign={{sm: 'right'}}>
                    <Typography variant='body2' style={{color: '#6F7985'}}>
                        {label}
                    </Typography>
                </Box>
            </Grid>
        </Box>
        <Grid xs={12} sm item>
            <InputBase
                inputRef={fieldRef}
                multiline
                rowsMin={3}
                rows={3}
                rowsMax={10}
                {...inputProps} style={{
                background: 'white',
                borderRadius: 8,
                paddingLeft: 12,
                paddingRight: 12,
                display: 'block',
                ...(inputProps.style || {})
            }}/>
        </Grid>
    </Grid>
}


const GrayField: React.FC<{ label: string, inputProps?: InputBaseProps }> = ({label, inputProps = {}}) => {
    const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
    const onClick = useCallback(() => {
        fieldRef.current?.focus()
    }, [fieldRef.current])

    return <Grid onClick={onClick} item xs container alignItems='baseline'>
        <Grid xs={12} md='auto' item style={{marginRight: 16}}>
            <Box clone textAlign={{md: 'right'}}>
                <Typography variant='body2' style={{color: '#6F7985'}}>
                    {label}
                </Typography>
            </Box>
        </Grid>
        <Grid xs={12} sm item>
            <InputBase inputRef={fieldRef} {...inputProps} style={{
                background: 'white',
                borderRadius: 8,
                paddingLeft: 12,
                paddingRight: 12,
                display: 'block',
                height: 32,
                ...(inputProps.style || {})
            }}/>
        </Grid>
    </Grid>
}

export const WhiteField: React.FC<{ label: string, prefix?: string, inputProps?: InputBaseProps }> = ({label, prefix, inputProps = {}}) => {

    const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
    const onClick = useCallback(() => {
        fieldRef.current?.focus()
    }, [fieldRef.current])

    return <Grid onClick={onClick} item xs container alignItems='baseline'
                 style={{minHeight: 32}}>
        <Grid item sm={6} container>
            <Hidden xsDown>
                <Typography variant='body2' style={{color: '#6F7985'}}>
                    {label}
                </Typography>
                <FlexSpace/>
                <AdditionalText>
                    {prefix}
                </AdditionalText>
            </Hidden>
        </Grid>
        <Grid item xs sm>
            <Box clone marginLeft={{xs: '20px', sm: '0'}}>
                <InputBase inputRef={fieldRef} fullWidth {...inputProps}
                           style={{
                               // paddingLeft: 12,
                               paddingRight: 12,
                               display: 'block',
                               height: 32,
                               ...(inputProps.style || {})
                           }}/>
            </Box>
        </Grid>
    </Grid>
}

export const WhiteFieldLabel: React.FC<{ label: string }> = ({label}) => {
    return <Hidden smUp><Typography variant='body2'
                                    style={{color: '#6F7985', marginTop: 16}}>
        {label}
    </Typography>
    </Hidden>
}

export const Skills: React.FC<{
    disabled: boolean,
    onChange: (skills: UserSkill[]) => void,
    onJobSelect?: (jobId: number) => void,
    currentJob?: number,
    value: UserSkill[]
}> = ({disabled, currentJob, onJobSelect, onChange, value}) => {

    const classes = useChipStyles()
    const [jobs, setJobs] = useState<{ name: string, id: number }[]>([])
    const [selectedJob, selectJob] = useState(currentJob === undefined ? -1 : currentJob)

    const [skills, setSkills] = useState<{ [key: string]: UserSkill[] }>({})
    const [selectedSkills, selectSkills] = useState<{ [key: string]: boolean[] }>({})

    useEffect(() => {
        (async () => {
            const jobs = await getJobs()
            setJobs(jobs)
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(currentJob !== undefined) {
            selectJob(jobs.findIndex(j => j.id === Number(currentJob)))
        }
    }, [currentJob, jobs.length])
    useEffect(() => {
        (async () => {
            if (jobs[selectedJob]) {
                const aSkills = await getSkills(jobs[selectedJob].name)
                if (!skills[jobs[selectedJob].name]?.length) {
                    setSkills({...skills, [jobs[selectedJob].name]: aSkills})
                    selectSkills({
                        ...selectedSkills,
                        [jobs[selectedJob].name]: aSkills.map((sk) => {
                            return !!value.find(s => s.id === sk.id || s.name === sk.name)

                        })
                    })
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedJob, jobs])

    useEffect(() => {
        const s: UserSkill[] = []
        if (!Object.keys(selectedSkills).length) return
        for (let key of jobs.map(j => j.name)) {
            if (skills[key]?.length > 0) {
                selectedSkills[key].forEach((sk, i) => sk && s.push({...skills[key][i]}))
            } else {
                const j = jobs.find(j => j.name === key)
                if (j) {
                    s.push(...value.filter(s => s.jobId === j.id.toString()))
                }
            }
        }
        onChange(s)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSkills])

    return <Grid container direction='column'>
        <Typography variant='h1' style={{
            marginTop: 0,
            fontSize: 19
        }}>Доступные категории</Typography>

        <div className={classes.root}>
            {
                jobs.map((j, i) => <Zoom key={j.name} in><Chip
                    clickable={!disabled}
                    disabled={disabled}
                    onClick={
                        () => {
                            if (selectedJob === i) {
                                selectJob(-1)
                                onJobSelect?.(-1)
                            } else {
                                selectJob(i)
                                onJobSelect?.(jobs[i].id)
                            }
                        }
                    }
                    className={
                        selectedJob >= 0 ?
                        selectedJob === i ?
                            classes.selected : selectedSkills[jobs[i]?.name]?.includes(true) || value.find(x => x.jobId === j.id.toString()) ? classes.contains : classes.default :
                        selectedSkills[jobs[i]?.name]?.includes(true) || value.find(v => v.jobId === jobs[i].id.toString()) ? classes.contains : classes.default
                    }
                    label={j.name}
                /></Zoom>)
            }
        </div>
        {
            ~selectedJob ?
                <Typography variant='h2' style={{
                    marginTop: 0,
                }}>Доступные навыки</Typography> : null
        }
        <div className={classes.root}>
            {
                skills[jobs[selectedJob]?.name]?.map((j, i) => (
                    <Zoom key={j.id} in><Chip disabled={disabled}
                                              clickable={!disabled}
                                              onClick={
                                                  () => {
                                                      const selected = {...selectedSkills}
                                                      selected[jobs[selectedJob]?.name][i] = !selected[jobs[selectedJob]?.name][i]
                                                      selectSkills(selected)
                                                  }
                                              }
                                              className={selectedSkills[jobs[selectedJob]?.name]?.[i] ? classes.selected : classes.default}
                                              label={j.name}
                    /></Zoom>))
            }
        </div>
    </Grid>
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const UserEditModalContext = React.createContext()

const useUserEdit = () => {
    const {cUser, user} = useAppState()
    const [firstName, setFirstName] = useState(cUser.firstName)
    const [lastName, setLastName] = useState(cUser.lastName)
    const [job, setJob] = useState(cUser.jobName)
    const [vk, setVk] = useState('')
    const [tg, setTg] = useState('')
    const [gh, setGh] = useState('')
    const [bio, setBio] = useState(cUser.bio)
    const [sDesc, setSDesc] = useState(cUser.skills.description)
    const [disabled, setDisabled] = useState(false)
    const [skills, setSkills] = useState<UserSkill[]>(cUser.skills.tags)
    const nc = useNotificationHandlers()
    const reset = () => {
        if (cUser.id !== '-1') {
            setFirstName(cUser.firstName.trim())
            setLastName(cUser.lastName.trim())
            setJob(cUser.jobName.trim())
            setVk(cUser.settings.vk.trim())
            setTg(cUser.settings.tg.trim())
            setGh(cUser.settings.gh.trim())
            setBio(cUser.bio.trim())
            setSDesc(cUser.skills.description.trim())
            setSkills(cUser.skills.tags.sort((t1, t2) => Number(t1.id) - Number(t2.id)))
            setDisabled(false)
        }
    }

    useEffect(reset, [cUser.id])
    return {
        firstName: {
            value: firstName,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)
        },
        lastName: {
            value: lastName,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)
        },
        job: {
            value: job,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setJob(e.target.value)
        },
        vk: {
            value: vk,
            disabled: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setVk(e.target.value)
        },
        tg: {
            value: tg,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTg(e.target.value)
        },
        gh: {
            value: gh,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setGh(e.target.value)
        },
        bio: {
            value: bio,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value)
        },
        sDesc: {
            value: sDesc,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSDesc(e.target.value)
        },
        skills: {
            value: skills,
            disabled,
            onChange: (s: UserSkill[]) => setSkills(s)
        },
        disabled,
        onSubmit: async () => {
            const diff = storeDiff(cUser, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                jobName: job.trim(),
                bio: bio.trim()
            })
            setDisabled(true)
            diff.skills = {
                tags: skills,
                description: sDesc
            }
            diff.settings = {
                vk: vk.trim(), tg: tg.trim(), gh: gh.trim()
            }
            diff.id = cUser.id
            const update = await modifyUser(diff as UserOptional & { id: string })
            setDisabled(false)
            cUser.change(diff)
            user.change(diff)
            nc.update()
            return update
        },
        onCancel: () => {
            reset()
        },
        errors: {}
    }
}
export const UserEditModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
    const [disabled, setDisabled] = useState(false)

    const fields = useUserEdit()
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
                Информация о пользователе
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                Более подробная информация увеличивает Ваши шансы
                на поиск лучшей команды
            </AdditionalText>
            <GrayPlate style={{marginTop: 16}}>
                <Box clone flexDirection={{xs: 'column', sm: 'row'}}>
                    <Grid container spacing={4}>
                        <GrayField label='Имя' inputProps={{
                            placeholder: 'Василий',
                            ...fields.firstName
                        }}/>
                        <GrayField label='Фамилия' inputProps={{
                            placeholder: 'Петров',
                            ...fields.lastName
                        }}/>
                    </Grid>
                </Box>
            </GrayPlate>
            <WhiteFieldLabel label='Место работы'/>
            <Box clone marginTop={{xs: 0, sm: '16px'}}>
                <Plate elevation={4} padding={8}>
                    <WhiteField label='Место работы' inputProps={{
                        placeholder: 'Тинькофф',
                        ...fields.job
                    }}/>
                </Plate>
            </Box>
            <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
                Социальные сети
            </Typography>
            <WhiteFieldLabel label='ВКонтакте'/>
            <Box clone marginTop={{xs: 0, sm: '16px'}}>
                <Plate elevation={4} padding={8}>
                    <WhiteField prefix='vk.com/' label='ВКонтакте' inputProps={{
                        placeholder: 'teamuponline',
                        ...fields.vk,
                        style: {
                            color: '#3E74DB'
                        }
                    }}/>
                </Plate>
            </Box>
            <WhiteFieldLabel label='Телеграм'/>
            <Box clone marginTop={{xs: 0, sm: '16px'}}>
                <Plate elevation={4} padding={8}>
                    <WhiteField prefix='t.me/' label='Телеграм' inputProps={{
                        placeholder: 'teamuponline',
                        ...fields.tg
                    }}/>
                </Plate>
            </Box>
            <WhiteFieldLabel label='Github'/>
            <Box clone marginTop={{xs: 0, sm: '16px'}}>
                <Plate elevation={4} padding={8}>
                    <WhiteField prefix='github.com/' label='Github'
                                inputProps={{
                                    placeholder: 'teamuponline',
                                    ...fields.gh
                                }}/>
                </Plate>
            </Box>
            <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
                Дополнительная информация
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                Расскажите больше о своих увлечениях и навыках.
            </AdditionalText>
            <GrayPlate style={{marginTop: 16}}>
                <Grid direction='column' container spacing={4}>
                    <MultilineGrayField label='О себе' inputProps={{
                        placeholder: 'Например, в свободное от работы время я бегаю',
                        ...fields.bio
                    }}/>
                </Grid>
            </GrayPlate>
            <Typography variant='h2' style={{
                fontSize: 22,
                marginTop: 24,
            }}>Выбранные навыки</Typography>
            {fields.skills.value.length > 0 ? <Box clone marginTop={2} marginBottom={2}><ChosenSkills user={{
                    ...NULL_USER,
                skills: {
                        description: '',
                        tags: fields.skills.value,
                },
            }
                }/></Box> :
                <AdditionalText style={{marginTop: 16, marginBottom: 16}}>
                    Выберите один или несколько навыков в интересующих Вас
                    профессиях
                </AdditionalText>
            }
            <Skills {...fields.skills}/>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 0}} spacing={1}>
                <Grid item>
                    <Button disabled={fields.disabled}
                            style={{color: '#818C99'}}
                            onClick={(e) => {
                                fields.onCancel()
                                props.close && props.close(e)
                            }}>
                        Отменить
                    </Button>
                </Grid>
                <Grid item>
                    <SecondaryButton disabled={fields.disabled}
                                     onClick={async (e) => {
                                         await fields.onSubmit()
                                         props.close && props.close(e)
                                     }}>
                        Сохранить
                    </SecondaryButton>
                </Grid>
            </Grid>
        </Grid>
    </Modal>
}

export type UseUserEditModalType = ReturnType<typeof _useUserEditModal>

export const UserEditModalProvider: React.FC = ({children}) => {
    const modalState = _useUserEditModal()
    return <UserEditModalContext.Provider value={modalState}>
        <UserEditModal
            onSubmitClick={modalState.onSubmit}
            open={modalState.isOpen}
            close={modalState.close}/>
        {children}
    </UserEditModalContext.Provider>
}

export const useUserEditModal: () => UseUserEditModalType = () => {
    const context = React.useContext(UserEditModalContext)
    if (context === undefined) {
        throw new Error('useUserEditModal must be used within a UserEditModalProvider')
    }
    return context as UseUserEditModalType
}