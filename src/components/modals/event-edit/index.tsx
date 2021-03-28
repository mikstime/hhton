import React, {useCallback, useEffect, useState} from 'react'
import {
    AdditionalText,
    Modal,
    ModalProps,
    Plate,
} from '../../common'
import {
    Box,
    Button,
    Grid,
    Omit,
    Typography
} from '@material-ui/core'
import {SecondaryButton} from '../../common/buttons'
import {GeneralSection} from './general'
import {WhiteField, WhiteFieldLabel} from '../user-edit'
import {EventPrizes} from './prizes'

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
                Информация о мероприятии
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                Обозначьте даты проведения мероприятия.
                Ограничьте размер команды, общее число участников
            </AdditionalText>
            <GeneralSection/>
            <WhiteFieldLabel label='Место проведения'/>
            <Box clone marginTop={{xs: 0, sm: '16px'}}>
                <Plate elevation={4} padding={8}>
                    <WhiteField label='Место проведения' inputProps={{
                        placeholder: 'Москва',
                    }}/>
                </Plate>
            </Box>
            <WhiteFieldLabel label='Сайт мероприятия'/>
            <Box clone marginTop={{xs: 0, sm: '16px'}}>
                <Plate elevation={4} padding={8}>
                    <WhiteField label='Сайт мероприятия' inputProps={{
                        placeholder: 'team-up.online',
                    }}/>
                </Plate>
            </Box>
            <Typography variant='h2' style={{fontSize: 22, marginTop: 24}}>
                Призовой фонд
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                Призовой фонд позволит привлечь больше участников
            </AdditionalText>
            <EventPrizes/>
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