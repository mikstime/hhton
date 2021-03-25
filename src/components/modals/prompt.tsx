import React, {useCallback, useEffect, useState} from 'react'
import {Modal, ModalProps} from '../common'
import {Button, Grid, Omit, Typography} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'

const _usePromptModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [onSubmit, setOnSubmit] = useState<Function | undefined>(undefined)
    const [message, setMessage] = useState('')
    const [accept, setAccept] = useState('Принять')
    const [decline, setDecline] = useState('Отклонить')
    const open = useCallback((
        {onSubmit, message, accept = 'Принять', decline = 'Отклонить'}) => {
        setOnSubmit(() => onSubmit)
        setAccept(accept)
        setMessage(message)
        setDecline(decline)
        setIsOpen(true)
    }, [setIsOpen, setOnSubmit, setAccept, setDecline, setMessage])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    return {
        open,
        close,
        isOpen,
        message,
        accept,
        decline,
        onSubmit: () => onSubmit && onSubmit()
    }
}

interface MProps extends Omit<ModalProps, 'children'> {
}

//@ts-ignore
const PromptModalContext = React.createContext()

export const PromptModal: React.FC<{
    onSubmitClick: () => any, message: string, accept: string, decline: string
} & MProps> = ({children, onSubmitClick, message, accept, decline, ...props}) => {
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
            <Typography align='center'>
                {message}
            </Typography>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 16}} spacing={1}>
                <Grid item>
                    <Button style={{color: '#818C99'}} disabled={disabled} onClick={() => {
                        setDisabled(true)
                    }}>
                        {accept}
                    </Button>
                </Grid>
                <Grid item>
                    <PrimaryButton disabled={disabled} onClick={props.close}>
                        {decline}
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    </Modal>
}

export type UsePromptModalType = ReturnType<typeof _usePromptModal>

export const PromptModalProvider: React.FC = ({children}) => {
    const modalState = _usePromptModal()
    return <PromptModalContext.Provider value={modalState}>
        <PromptModal
            onSubmitClick={modalState.onSubmit}
            message={modalState.message}
            accept={modalState.accept}
            decline={modalState.decline}
            open={modalState.isOpen}
            close={modalState.close}/>
        {children}
    </PromptModalContext.Provider>
}

export const usePromptModal: () => UsePromptModalType = () => {
    const context = React.useContext(PromptModalContext)
    if (context === undefined) {
        throw new Error('usePromptModal must be used within a PromptModalProvider')
    }
    return context as UsePromptModalType
}