import React, {useEffect, useState} from 'react'
import {
    AdditionalText, Plate, Title
} from '../common'
import {
    Box,
    createStyles,
    Grid,
    makeStyles,
    Step,
    StepConnector,
    StepContent, StepIconProps,
    StepLabel,
    Stepper,
    Theme,
    Typography,
    withStyles
} from '@material-ui/core'
import clsx from 'clsx'
import {PrimaryButton, SecondaryButton} from '../common/buttons'
import {GeneralSection} from '../modals/event-edit/general'
import {EventPrizes} from '../modals/event-edit/prizes'
import {Additional} from '../modals/event-edit/additional'
import {useSnackbar} from 'notistack'
import {useEventEdit} from '../modals/event-edit'
import {WhiteField} from '../modals/user-edit'
import {Slide} from '@material-ui/core'
import {createEvent} from '../../model/api'
import {NULL_HACKATHON, useAppState} from '../tools/use-app-state'
import {useHistory} from 'react-router-dom'
import {Check} from '@material-ui/icons'

const useStyles = makeStyles(createStyles((theme: Theme) => ({
    root: {
        borderRadius: 8,
        paddingBottom: 40,
        [theme.breakpoints.only('xs')]: {
            padding: 0,
            background: 'transparent'
        }
    }
})))

const useQontoStepIconStyles = makeStyles((theme: Theme) => ({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        alignItems: 'center'
    },
    active: {
        color: theme.palette.primary.main
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: 'currentColor'
    },
    completed: {
        color: theme.palette.primary.main,
        zIndex: 1,
        fontSize: 18,
        marginRight: 6
    }
}))

function QontoStepIcon(props: StepIconProps) {
    const classes = useQontoStepIconStyles()
    const {active, completed} = props

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active
            })}
        >
            {completed ? <Check className={classes.completed}/> :
                <div className={classes.circle}/>}
        </div>
    )
}

export const CreateEventApp: React.FC = () => {
    const [disabled] = useState(false)
    const [name, setName] = useState('')
    const {enqueueSnackbar} = useSnackbar()
    const [step, setStep] = useState(1)

    const classes = useStyles()
    const edit = useEventEdit()

    const {event, cEvent, settings} = useAppState()
    useEffect(() => {
        if (event.id !== '-1') {
            edit.nullReset()
        }
    }, [event.id])
    const history = useHistory()

    useEffect(() => {
        if (!settings.isHostMode) {
            history.push('/user')
        }
    }, [settings.isHostMode])

    const stepOne = <Step active={step > 0}>
        <StepLabel StepIconComponent={QontoStepIcon}>
            {step > 0 && <Typography variant='h2' style={{fontSize: 22}}>
              Информация о мероприятии
            </Typography>}
        </StepLabel>
        <StepContent>
            <AdditionalText style={{marginTop: 16, marginBottom: 16}}>
                Будьте осторожны, название выбирается лишь однажды, и не
                может быть
                изменено.
            </AdditionalText>
            <Box clone marginTop={{xs: 0, sm: '16px'}}>
                <Plate elevation={4} padding={8}>
                    <WhiteField label='Название мероприятия' inputProps={{
                        placeholder: 'Мой хакатон',
                        value: name,
                        onChange: (e) => {
                            setName(e.target.value)
                        }
                    }}/>
                </Plate>
            </Box>
        </StepContent>
    </Step>

    const stepTwo = <Step active={step > 1}>
        <StepLabel StepIconComponent={QontoStepIcon}>
            {step > 1 && <Typography variant='h2' style={{fontSize: 22}}>
              Дополнительная информация
            </Typography>}
        </StepLabel>
        <StepContent>
            <AdditionalText style={{marginTop: 16}}>
                Обозначьте даты проведения мероприятия.
                Ограничьте размер команды, общее число участников
            </AdditionalText>
            <GeneralSection {...edit.general}/>
            <Additional {...edit.additional}/>
        </StepContent>
    </Step>

    const stepThree = <Step active={step > 2}>
        <StepLabel StepIconComponent={QontoStepIcon}>
            {step > 2 && <Typography variant='h2' style={{fontSize: 22}}>
              Призовые места
            </Typography>}
        </StepLabel>
        <StepContent>
            <AdditionalText style={{marginTop: 16}}>
                До завершения мероприятия возможно определить призовые места
            </AdditionalText>
            <EventPrizes {...edit.prizes}/>
        </StepContent>
    </Step>

    return <Grid container style={{position: 'relative'}}>
        <Grid container direction='column'>
            {/*<Box height='32px'/>*/}
            <Typography variant='h1' style={{marginBottom: 16}}>
                Создание мероприятия
            </Typography>
            <Stepper activeStep={step - 1}
                     classes={classes}
                     orientation="vertical">
                {stepOne}
                {stepTwo}
                {stepThree}
            </Stepper>
            <Grid container direction='row' justify='flex-end'>
                <Box clone marginTop='16px !important' paddingRight={{xs: 1, sm: 3}}>
                <Grid item>
                    {step > 2 ? <SecondaryButton
                            disabled={disabled}
                            onClick={async () => {
                                const val = edit.getSubmit()
                                val.diff.name = name
                                const id = await createEvent(val)
                                if (id) {
                                    event.change({id})
                                    cEvent.change({id})
                                    history.push(`/event/${id}`)
                                } else {
                                    enqueueSnackbar('Не удалось создать событие', {
                                        variant: 'error'
                                    })
                                }
                            }}>
                            Создать
                        </SecondaryButton> :
                        <PrimaryButton disabled={disabled} onClick={() => {
                            setStep(step + 1)
                        }}>
                            Далее
                        </PrimaryButton>}
                </Grid>
                </Box>
            </Grid>
            <Box height='100px'/>
        </Grid>
    </Grid>
}