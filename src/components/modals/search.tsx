import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
    AdditionalText, FlexSpace, GrayPlate,
    MainText,
    Modal,
    ModalProps,
    Plate
} from '../common'
import {
    Avatar,
    Grid, IconButton,
    InputBase,
    Omit,
    Slide,
    Typography
} from '@material-ui/core'
import {SearchButton} from '../event/search-button'
import {InviteButton} from '../event/invite-button'
import {findUsers} from '../../model/api'
import {Id, NULL_USER, User, UserSkill} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'
import {PrimaryButton} from '../common/buttons'
import {useHistory, useLocation} from 'react-router-dom'
import {useAppState} from '../tools/use-app-state'
import {ReactComponent as CopyIcon} from '../../assets/copy.svg'
import {copyTextToClipboard} from '../../utils'
import {ChosenSkills} from '../common/display-skills'
import {Skills} from './user-edit'
import {useJobs} from '../tools/useJobs'

const _useSearchModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [current, setCurrent] = useState<'start' | 'smart' | 'user'>('start')
    const [props, setProps] = useState<{ canGoBack?: boolean }>({})
    const history = useHistory()
    const open = useCallback((x?: {
        current: 'start' | 'smart' | 'user',
        props: { canGoBack?: boolean }
    }) => {
        setIsOpen(true)
        setCurrent(x?.current ?? 'start')
        setProps(x?.props ?? {})
    }, [setIsOpen, setCurrent])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSmartClick = useCallback(() => {
        // setCurrent('smart')
        history.push('/feed')
        close()
    }, [setCurrent])

    const onUserClick = useCallback(() => {
        // setCurrent('user')
        close()
    }, [setCurrent])

    const back = useCallback(() => {
        setCurrent('start')
    }, [setCurrent])

    return {
        state: {
            isOpen,
            current,
            onSmartClick,
            onUserClick
        },
        actions: {
            open,
            close,
            back
        },
        props
    }
}


export type UseSearchModalType = ReturnType<typeof _useSearchModal>


interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const SearchModalContext = React.createContext()

export const SearchModal: React.FC<UseSearchModalType & MProps> = (props) => {
    if (props.state.current === 'user') {
        return <SearchUser {...props}/>
    } else if (props.state.current === 'smart') {
        return <SearchSmart {...props}/>
    }
    return <SearchStart {...props}/>
}


const SearchSmart: React.FC<UseSearchModalType & MProps> = ({actions: {back, close}, ...props}) => {
    const history = useHistory()
    const location = useLocation()
    const [skills, setSkills] = useState<UserSkill[]>([])
    const [currentJob, setCurrentJob] = useState(-1)
    const {getJobName, getJobId} = useJobs()

    const onJobSelect = useCallback((j: number) => {
        setCurrentJob(j)
    }, [setCurrentJob])
    const onChange = useCallback((s: UserSkill[]) => {
        setSkills(s)
    }, [setSkills])
//job=3D designer&skills=ZBrush
    useEffect(() => {
        let lastJobId
        const parsed = decodeURIComponent(location.search.slice(1))
            .split('&job=').reduce((a, p) => {
                const split = p.split('&')
                const jName = split[0].replace('job=', '')
                const jId = getJobId(jName)
                lastJobId = jId
                const skills = jId === '-1' ? [] : split
                    .splice(1)
                    .map((s) => ({
                        jobId: jId,
                        name: s.replace('skills=', '')
                    } as UserSkill))

                return [...a, ...skills]
            }, [] as UserSkill[])
        if (parsed.length === 0) {
            setCurrentJob(Number(lastJobId) || -1)
            setSkills([])
        } else {
            setCurrentJob(-1)
            setSkills(parsed)
        }
    }, [location.search, props.state.isOpen, props.open])

    const showFeed = useCallback(() => {
        if (skills.length === 0) {
            if (currentJob !== -1) {
                history.push(`/feed?job=${encodeURIComponent(getJobName(currentJob))}`)
            } else {
                history.push('/feed')
            }
        } else {
            const skillsByJobs = skills.reduce((a, s) => {
                if (!a[s.jobId ?? '-1']) {
                    a[s.jobId ?? '-1'] = []
                }
                a[s.jobId ?? '-1'].push(s)
                return a

            }, {} as { [key: string]: UserSkill[] })

            let res = '/feed?'
            for (let [key, value] of Object.entries(skillsByJobs)) {
                res += `job=${getJobName(key)}&skills=${value.map(v => v.name).join('&skills=')}&`
            }
            history.push(encodeURIComponent(res.slice(0, -1)))
        }
        close()

    }, [close, history, skills, currentJob, getJobName])

    return <Modal back={back} canGoBack
                  onClose={props.close}{...props}>
        <Slide direction="right" in>
            <Grid container direction='column'>
                <Typography variant='h2' style={{fontSize: 19}}>
                    {skills.length > 0 ? 'Я ищу' : 'Параметры поиска'}
                </Typography>
                {skills.length ?
                    <ChosenSkills user={{
                        ...NULL_USER,
                        skills: {
                            description: '',
                            tags: skills
                        }
                    }}
                                  style={{marginTop: 16, marginBottom: 16}}
                    /> :
                    <AdditionalText style={{marginTop: 16, marginBottom: 16}}>
                        Выберите один или несколько навыков в интересующих Вас
                        профессиях
                    </AdditionalText>
                }
                <Skills currentJob={currentJob} disabled={false}
                        onChange={onChange} value={skills}
                        onJobSelect={onJobSelect}/>
                <Grid item container justify='flex-end'>
                    <PrimaryButton
                        onClick={showFeed}>{skills.length > 0 ?
                        'Показать выбранные' : currentJob !== -1 ? `Показать ${getJobName(currentJob)}` : 'Показать всех'}</PrimaryButton>
                </Grid>
            </Grid>
        </Slide>
    </Modal>
}

const SearchStart: React.FC<UseSearchModalType & MProps> = ({state: {onSmartClick, onUserClick}, ...props}) => {
    return <Modal onClose={props.close}{...props}>
        <Grid container direction='column'>
            <Typography variant='h1'>
                Не знаете, кого пригласить к себе в команду?
            </Typography>
            <SearchButton onClick={onSmartClick}/>
            <Grid item onClick={onUserClick}>
                <InviteButton>Я знаю, кого позвать</InviteButton>
            </Grid>
        </Grid>
    </Modal>
}


const SearchUser: React.FC<UseSearchModalType & MProps> = ({...props}) => {

    const {cEvent} = useAppState()
    const [results, setResults] = useState<User[]>([])
    const [value, setValue] = useState('')
    const field = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        (async () => {
            if (value.trim().length) {
                setIsLoading(true)
                const users = await findUsers(value, cEvent.id)
                setIsLoading(false)
                if (field.current) {
                    if (field.current.value === value) {
                        setResults([...users])
                    }
                }
            } else {
                setResults([])
            }
        })()
    }, [value, field])

    return <Modal back={props.actions.back} canGoBack
                  onClose={props.close}{...props}>
        <Slide direction="right" in>
            <Grid container direction='column'>
                <Typography variant='h1'>
                    Тег пользователя
                </Typography>
                <Grid item container direction='column' style={{marginTop: 16}}>
                    <Plate
                        padding={8} elevation={4}
                        style={{
                            position: 'sticky',
                            top: 20,
                            zIndex: 5
                        }}
                    >
                        <Grid container alignItems='baseline' wrap='nowrap'>
                            <AdditionalText
                                style={{marginLeft: '8px'}}>vk.com/</AdditionalText>
                            <InputBase
                                inputRef={field}
                                value={value}
                                fullWidth
                                onChange={(e) => {
                                    setValue(e.target.value)
                                }}
                                placeholder='lebedev'
                            />
                        </Grid>
                    </Plate>
                    {value && results.length > 0 && results.map(r => (
                        <Link to={`/user/${r.id}`}
                              style={{textDecoration: 'none'}} key={r.id}
                              onClick={() => {
                                  props.actions.close()
                              }}>
                            <Plate padding={8} style={{
                                marginTop: 16,
                                backgroundColor: '#F5F5F5'
                            }}>
                                <Grid container alignItems='center'>
                                    <Avatar style={{
                                        width: 32,
                                        height: 32,
                                        marginRight: 12
                                    }} src={r.avatar}/>
                                    <MainText>{r.firstName} {r.lastName}</MainText>
                                </Grid>
                            </Plate>
                        </Link>
                    ))
                    }
                    {
                        value && !results.length &&
                        <Grid container justify='center'
                              style={{
                                  marginTop: 12,
                                  opacity: isLoading ? '0' : '1'
                              }}><AdditionalText>
                          Никого не нашлось, но вы можете пригласить человека,
                          отправив ему ссылку на мероприятие:
                        </AdditionalText>
                          <GrayPlate style={{marginTop: 16}}>
                            <Grid container alignItems='center'>
                              <Typography variant='body1'>
                                team-up.online/event/{cEvent.id}</Typography>
                              <FlexSpace/>
                              <IconButton size='small' onClick={() => {
                                  const str = `https://team-up.online/event/${cEvent.id}`
                                  copyTextToClipboard(str)
                              }}>
                                <CopyIcon/>
                              </IconButton>
                            </Grid>
                          </GrayPlate>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Slide>
    </Modal>
}


export const SearchModalProvider: React.FC = ({children}) => {
    const modalState = _useSearchModal()

    return <SearchModalContext.Provider value={modalState}>
        <SearchModal {...modalState} {...modalState.props}
                     open={modalState.state.isOpen}
                     close={modalState.actions.close}/>
        {children}
    </SearchModalContext.Provider>
}

export const useSearchModal: () => UseSearchModalType = () => {
    const context = React.useContext(SearchModalContext)
    if (context === undefined) {
        throw new Error('useSearchModal must be used within a SearchModalProvider')
    }
    return context as UseSearchModalType
}