import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
    AdditionalText,
    MainText,
    Modal,
    ModalProps,
    Plate,
    Title
} from '../common'
import {
    Avatar, Chip, createStyles,
    Grid,
    InputBase, makeStyles,
    Omit,
    Slide, Theme,
    Typography, Zoom
} from '@material-ui/core'
import {SearchButton} from '../event/search-button'
import {InviteButton} from '../event/invite-button'
import {findUsers, getJobs, getSkills} from '../../model/api'
import {User} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'
import {PrimaryButton} from '../common/buttons'
import {useHistory} from 'react-router-dom'


const _useSearchModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [current, setCurrent] = useState<'start' | 'smart' | 'user'>('start')

    const open = useCallback(() => {
        setIsOpen(true)
        setCurrent('start')
    }, [setIsOpen, setCurrent])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    const onSmartClick = useCallback(() => {
        setCurrent('smart')
    }, [setCurrent])

    const onUserClick = useCallback(() => {
        setCurrent('user')
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
        }
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            // justifyContent: 'center',
            flexWrap: 'wrap',
            margin: '16px -16px 16px -16px',
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

const SearchSmart: React.FC<UseSearchModalType & MProps> = ({actions: {back, close}, ...props}) => {

    const classes = useStyles()

    const [jobs, setJobs] = useState<string[]>([])
    const [selectedJob, selectJob] = useState(-1)

    const [skills, setSkills] = useState<string[]>([])
    const [selectedSkills, selectSkills] = useState<boolean[]>([])

    const history = useHistory();
    // const [hasSelected, setHasSelected] = useState(false)

    useEffect(() => {
        (async () => {
            const jobs = await getJobs()
            setJobs(jobs)
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        (async () => {
            setSkills([])
            selectSkills([])
            if (~selectedJob) {
                const skills = await getSkills(jobs[selectedJob])
                setSkills(skills)
                selectSkills(skills.map(() => false))
            }
        })()
    }, [selectedJob, jobs])

    // useEffect(() => {
    //     setHasSelected(selectedSkills.includes(true))
    // }, [selectedSkills])

    const showFeed = useCallback(() => {
        const fjob = jobs[selectedJob]
        const fskills = skills.filter((s, i) => selectedSkills[i])
        if(fskills.length) {
            history.push(`/feed?j=${fjob}&skills=${fskills.join('|')}`)
        } else {
            history.push(`/feed?j=${fjob}`)
        }
        close()

    }, [selectedJob, close, history, jobs, selectedSkills, skills])

    return <Modal back={back} canGoBack
                  gridProps={{item: true, md: 8, sm: 10, xs: 12}}
                  onClose={props.close}{...props}>
        <Slide direction="right" in>
            <Grid container direction='column'>
                <Title style={{marginTop: 0}}>Я ищу</Title>

                <div className={classes.root}>
                    {
                        jobs.map((j, i) => <Zoom key={j} in><Chip
                            onClick={
                                () => {
                                    if (selectedJob === i) {
                                        selectJob(-1)
                                    } else {
                                        selectJob(i)
                                    }
                                }
                            }
                            className={selectedJob >= 0 ? selectedJob === i ? classes.selected : classes.notSelected : ''}
                            label={j}
                        /></Zoom>)
                    }
                </div>
                {
                    ~selectedJob ?
                        <Title style={{marginTop: 0}}>С навыками</Title> : null
                }
                <div className={classes.root}>
                    {
                        skills.map((j, i) => <Zoom key={j} in><Chip
                            onClick={
                                () => {
                                    const selected = [...selectedSkills]
                                    selected[i] = !selected[i]
                                    selectSkills(selected)
                                }
                            }
                            className={selectedSkills[i] ? classes.selected : ''}
                            label={j}
                        /></Zoom>)
                    }
                </div>
                {
                    selectedJob >= 0 && <Grid item container justify='flex-end'>
                      <PrimaryButton onClick={showFeed}>Показать</PrimaryButton>
                    </Grid>
                }
            </Grid>
        </Slide>
    </Modal>
}

const SearchStart: React.FC<UseSearchModalType & MProps> = ({state: {onSmartClick, onUserClick}, ...props}) => {
    return <Modal gridProps={{item: true, md: 8, sm: 8, xs: 10}}
                  onClose={props.close}{...props}>
        <Grid container direction='column'>
            <Typography variant='h1'>
                Не знаете, кого пригласить к себе в команду?
            </Typography>
            <SearchButton onClick={onSmartClick}/>
            <Grid item onClick={onUserClick}><InviteButton/>
            </Grid>
        </Grid>
    </Modal>
}


const SearchUser: React.FC<UseSearchModalType & MProps> = ({...props}) => {

    const [results, setResults] = useState<User[]>([])
    const [value, setValue] = useState('')
    const field = useRef<HTMLInputElement>(null)
    useEffect(() => {
        (async () => {
            if (value.trim().length) {
                const users = await findUsers(value)
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
                  gridProps={{item: true, md: 8, sm: 10, xs: 12}}
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
                            <Typography
                                style={{marginLeft: '8px'}}>@</Typography>
                            <InputBase
                                inputRef={field}
                                value={value}
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
                              style={{marginTop: 12}}><AdditionalText>
                          Никого не нашлось =с
                        </AdditionalText>
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
        <SearchModal {...modalState} open={modalState.state.isOpen}
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