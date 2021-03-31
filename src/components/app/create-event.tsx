import React, {useEffect, useState} from 'react'
import {
    AdditionalText,
    ModalProps, Plate
} from '../common'
import {
    Box,
    Grid,
    Typography
} from '@material-ui/core'
import {PrimaryButton, SecondaryButton} from '../common/buttons'
import {GeneralSection} from '../modals/event-edit/general'
import {EventPrizes} from '../modals/event-edit/prizes'
import {Additional} from '../modals/event-edit/additional'
import {useSnackbar} from 'notistack'
import {useEventEdit} from '../modals/event-edit'
import {WhiteField} from '../modals/user-edit'
import {Slide} from '@material-ui/core'
import {createEvent} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import {useHistory} from 'react-router-dom'

export const CreateEventApp: React.FC = () => {
    const [disabled] = useState(false)
    const [name, setName] = useState('')
    const {enqueueSnackbar} = useSnackbar()
    const [step, setStep] = useState(1)

    const edit = useEventEdit()

    const {event, cEvent} = useAppState()
    useEffect(() => {
        if (event.id !== '-1') {
            edit.nullReset()
            // event.set(NULL_HACKATHON)
            // cEvent.set(NULL_HACKATHON)
        }
    }, [event.id])
    const history = useHistory()

    const stepOne = <div>
        <Typography variant='h2' style={{fontSize: 22}}>
            Информация о мероприятии
        </Typography>
        <AdditionalText style={{marginTop: 16}}>
            Будьте осторожны, название выбирается лишь однажды, и не может быть
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
    </div>

    const stepTwo = <div>
        <AdditionalText style={{marginTop: 16}}>
            Обозначьте даты проведения мероприятия.
            Ограничьте размер команды, общее число участников
        </AdditionalText>
        <GeneralSection {...edit.general}/>
        <Additional {...edit.additional}/>
    </div>

    const stepThree = <div>
        <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
            Призовые места
        </Typography>
        <AdditionalText style={{marginTop: 16}}>
            До завершения мероприятия возможно определить призовые места
        </AdditionalText>
        <EventPrizes {...edit.prizes}/>
    </div>

    return <Grid container style={{position: 'relative'}}>
        <Grid container direction='column'>
            {step > 0 && <Slide in direction='up'>{stepOne}</Slide>}
            {step > 1 && <Slide in direction='up'>{stepTwo}</Slide>}
            {step > 2 && <Slide in direction='up'>{stepThree}</Slide>}
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 32}} spacing={1}>
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
            </Grid>
        </Grid>
    </Grid>
}