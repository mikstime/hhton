import React, {useCallback, useEffect, useState} from 'react'
import {Modal, ModalProps} from '../common'
import {
    Box,
    Grid,
    Omit,
    TextField,
    Typography
} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'
import {useAppState} from '../tools/use-app-state'
import {useSnackbar} from 'notistack'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {useSearchModal} from './search'
import {joinEvent} from '../../model/api'

const _useJoinModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const open = useCallback(() => {
        setIsOpen(true)
    }, [setIsOpen])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    return {
        open,
        close,
        isOpen,
    }
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const JoinModalContext = React.createContext()

export const JoinModal: React.FC<MProps> = ({children, ...props}) => {
    const {cUser, cEvent, event} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    const sModal = useSearchModal()
    const [disabled, setDisabled] = useState(false)
    const [value, setValue] = useState('')

    const onSubmit = useCallback((e) => {
        setDisabled(true)
        joinEvent(cUser.id, event.id, value).then((didJoin?: boolean) => {
            if(didJoin) {
                props.close?.(e)
                event.change({isParticipating: true})
                cEvent.change({isParticipating: true})
                enqueueSnackbar(`Вы участвуете в мероприятии ${event.name}`, {
                    variant: 'success'
                })
                sModal.actions.open()
                nc.update()
            } else {
                enqueueSnackbar(`Неверный пароль`, {
                    variant: 'error'
                })
            }
        })
        setDisabled(false)
    }, [cUser.id, event.id, value, enqueueSnackbar,
        sModal.actions, nc.update, event.name, setDisabled])

    useEffect(() => {
        if (props.open) {
            setDisabled(false)
        }
    }, [props.open])
    return <Modal gridProps={{item: true, md: 10, sm: 10, xs: 12}}
                  onClose={props.close}{...props}>
        <Grid container direction='column'>
            <Typography variant='h2'>
                Для участия в данном мероприятии необходим пароль
            </Typography>
            <Grid item container>
                <Box paddingTop={2} width='100%'>
                <TextField
                    fullWidth
                    value={value} placeholder='Введите пароль' onChange={(e) => {
                    setValue(e.target.value)
                }}/>
                </Box>
            </Grid>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 16}} spacing={1}>
                <Grid item>
                    <PrimaryButton disabled={disabled || value.trim().length < 1} onClick={onSubmit}>
                        Подтвердить
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    </Modal>
}

export type UseJoinModalType = ReturnType<typeof _useJoinModal>

export const JoinModalProvider: React.FC = ({children}) => {
    const modalState = _useJoinModal()
    return <JoinModalContext.Provider value={modalState}>
        <JoinModal
            open={modalState.isOpen}
            close={modalState.close}/>
        {children}
    </JoinModalContext.Provider>
}

export const useJoinModal: () => UseJoinModalType = () => {
    const context = React.useContext(JoinModalContext)
    if (context === undefined) {
        throw new Error('useJoinModal must be used within a JoinModalProvider')
    }
    return context as UseJoinModalType
}