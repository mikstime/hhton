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
    Grid, Hidden,
    InputBase,
    InputBaseProps,
    Omit,
    Typography
} from '@material-ui/core'
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


interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const EventAboutModalContext = React.createContext()

export const EventAboutModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
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
                Более подробная информация увеличивает Ваши шансы
                на поиск лучшей команды
            </AdditionalText>
            <GrayPlate style={{marginTop: 16}}>
                <Grid container spacing={4}>
                    <GrayField label='Начало' inputProps={{
                        placeholder: 'Василий'
                    }}/>
                    <GrayField label='Число победителей' inputProps={{
                        placeholder: 'Петров'
                    }}/>
                </Grid>
                <Grid container spacing={4}>
                    <GrayField label='Конец' inputProps={{
                        placeholder: 'Василий'
                    }}/>
                    <GrayField label='Число участников' inputProps={{
                        placeholder: 'Петров'
                    }}/>
                </Grid>
            </GrayPlate>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField label='Место проведения' inputProps={{
                    placeholder: 'Москва'
                }}/>
            </Plate>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField label='Сайт мероприятия' inputProps={{
                    placeholder: 'team-up.online'
                }}/>
            </Plate>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 32}} spacing={1}>
                <Grid item>
                    <PrimaryButton disabled={disabled} onClick={props.close}>
                        Применить
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