import React, {useCallback, useEffect, useState} from 'react'
import {
    AdditionalText,
    FlexSpace,
    GrayPlate,
    Modal,
    ModalProps,
    Plate,
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
import {getJobs, getSkills} from '../../model/api'
import {UserSkill} from '../tools/use-app-state/user'

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


const MultilineGrayField: React.FC<{ label: string, inputProps?: InputBaseProps } & GridProps> = ({label, inputProps = {}, ...rest}) => {
    return <Grid item xs container alignItems='baseline' {...rest}>
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
    return <Grid item xs container alignItems='baseline' spacing={2}>
        <Box clone width={{md: '80px'}}>
            <Grid xs={12} md='auto' item>
                <Box clone textAlign={{md: 'right'}}>
                    <Typography variant='body2' style={{color: '#6F7985'}}>
                        {label}
                    </Typography>
                </Box>
            </Grid>
        </Box>
        <Grid xs={12} sm item>
            <InputBase {...inputProps} style={{
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

const WhiteField: React.FC<{ label: string, prefix?: string, inputProps?: InputBaseProps }> = ({label, prefix, inputProps = {}}) => {
    return <Grid item xs container alignItems='baseline'
                 style={{minHeight: 32}}>
        <Grid item xs sm={6} container>
            <Typography variant='body2' style={{color: '#6F7985'}}>
                {label}
            </Typography>
            <Hidden xsDown>
                <FlexSpace/>
                <AdditionalText>
                    {prefix}
                </AdditionalText>
            </Hidden>
        </Grid>
        <Grid item xs sm>
            <InputBase fullWidth {...inputProps} style={{
                // paddingLeft: 12,
                paddingRight: 12,
                display: 'block',
                height: 32,
                ...(inputProps.style || {})
            }}/>
        </Grid>
    </Grid>
}

const Skills: React.FC = () => {

    const classes = useChipStyles()

    const [jobs, setJobs] = useState<string[]>([])
    const [selectedJob, selectJob] = useState(-1)

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
        (async () => {
            if (jobs[selectedJob]) {
                const aSkills = await getSkills(jobs[selectedJob])
                if(!skills[jobs[selectedJob]]?.length) {
                    setSkills({...skills, [jobs[selectedJob]]: aSkills})
                    selectSkills({...selectedSkills, [jobs[selectedJob]]: aSkills.map(() => false)})
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedJob, jobs])

    return <Grid container direction='column'>
        <Typography variant='h1' style={{
            marginTop: 0,
            fontSize: 19
        }}>Специализация</Typography>

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
                    className={selectedJob >= 0 ?
                        selectedJob === i ?
                            classes.selected : selectedSkills[jobs[i]]?.includes(true) ? '' : classes.notSelected :
                        selectedSkills[jobs[i]]?.includes(true) ? classes.selected :''
                    }
                    label={j}
                /></Zoom>)
            }
        </div>
        {
            ~selectedJob ?
                <Typography variant='h1' style={{
                    marginTop: 0,
                    fontSize: 19
                }}>Навыки</Typography> : null
        }
        <div className={classes.root}>
            {
                skills[jobs[selectedJob]]?.map((j, i) => (
                    <Zoom key={j.id} in><Chip
                        onClick={
                            () => {
                                const selected = {...selectedSkills}
                                selected[jobs[selectedJob]][i] = !selected[jobs[selectedJob]][i]
                                selectSkills(selected)
                            }
                        }
                        className={selectedSkills[jobs[selectedJob]]?.[i] ? classes.selected : ''}
                        label={j.name}
                    /></Zoom>))
            }
        </div>
    </Grid>
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const EventEditModalContext = React.createContext()

export const EventEditModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
    const [disabled, setDisabled] = useState(false)

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
                <Grid container spacing={4}>
                    <GrayField label='Имя' inputProps={{
                        placeholder: 'Василий'
                    }}/>
                    <GrayField label='Фамилия' inputProps={{
                        placeholder: 'Петров'
                    }}/>
                </Grid>
            </GrayPlate>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField label='Место работы' inputProps={{
                    placeholder: 'Тинькофф'
                }}/>
            </Plate>
            <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
                Социальные сети
            </Typography>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField prefix='vk.com/' label='Вконтакте' inputProps={{
                    placeholder: 'teamuponline'
                }}/>
            </Plate>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField prefix='t.me/' label='Телеграм' inputProps={{
                    placeholder: 'teamuponline'
                }}/>
            </Plate>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField prefix='github.com/' label='Github' inputProps={{
                    placeholder: 'teamuponline'
                }}/>
            </Plate>
            <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
                Дополнительная информация
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                Расскажите больше о своих увлечениях и навыках.
            </AdditionalText>
            <GrayPlate style={{marginTop: 16}}>
                <Grid direction='column' container spacing={4}>
                    <MultilineGrayField label='О себе' inputProps={{
                        placeholder: 'В свободное от работы время я бегаю'
                    }}/>
                    <MultilineGrayField style={{paddingTop: 0}}
                                        label='О навыках' inputProps={{
                        placeholder: 'Первый свой полифилл я написал в 11 лет'
                    }}/>
                </Grid>
            </GrayPlate>
            <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
                Ваши навыки
            </Typography>
            <AdditionalText style={{marginTop: 16, marginBottom: 16}}>
                Выберите один или несколько навыков в интересующих Вас
                профессиях
            </AdditionalText>
            <Skills/>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 32}} spacing={1}>
                <Grid item>
                    <Button style={{color: '#818C99'}} disabled={disabled}
                            onClick={() => {
                                setDisabled(true)
                            }}>
                        Отменить
                    </Button>
                </Grid>
                <Grid item>
                    <SecondaryButton disabled={disabled} onClick={props.close}>
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