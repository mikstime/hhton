import React, {useCallback, useEffect, useState} from 'react'
import {AdditionalText, GrayPlate, Modal, ModalProps, Plate} from '../common'
import {
    Button,
    Grid,
    InputBase,
    InputBaseProps,
    Omit,
    Typography
} from '@material-ui/core'
import {SecondaryButton} from '../common/buttons'

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

const GrayField: React.FC<{ label: string, inputProps?: InputBaseProps }> = ({label, inputProps = {}}) => {
    return <Grid item xs container alignItems='baseline' spacing={2}> <Grid
        xs={12} sm={4} item>
        <Typography variant='body2' style={{color: '#6F7985'}} align='right'>
            {label}
        </Typography>
    </Grid>
        <Grid xs={12} sm={8} item>
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

const WhiteField: React.FC<{ label: string, inputProps?: InputBaseProps }> = ({label, inputProps = {}}) => {
    return <Grid item xs container alignItems='baseline'>
        <Grid item>
            <Typography variant='body2' style={{color: '#6F7985'}}>
                {label}
            </Typography>
        </Grid>
        <Grid item xs>
            <InputBase fullWidth {...inputProps} style={{
                paddingLeft: 12,
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
const UserEditModalContext = React.createContext()

export const UserEditModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
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
    return <Modal gridProps={{item: true, md: 10, sm: 10, xs: 12}}
                  onClose={props.close}{...props}>
        <Grid container direction='column'>
            <Typography variant='h2' style={{fontSize: 22}}>
                Информация о пользователе
            </Typography>
            <AdditionalText style={{marginTop: 16}}>
                Используйте этот стиль, если хотите выделить информацию в общем
                списке. Пример использования: подробная информация на странице
                сообщества
            </AdditionalText>
            <GrayPlate style={{marginTop: 16}}>
                <Grid container spacing={4}>
                    <GrayField label='имя' inputProps={{
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
                <WhiteField label='Вконтакте' inputProps={{
                    placeholder: 'Тинькофф'
                }}/>
            </Plate>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField label='Телеграм' inputProps={{
                    placeholder: 'Тинькофф'
                }}/>
            </Plate>
            <Plate elevation={4} padding={8} style={{marginTop: 16}}>
                <WhiteField label='Github' inputProps={{
                    placeholder: 'Тинькофф'
                }}/>
            </Plate>
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
                        Сохранить изменения
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