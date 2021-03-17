import React, {useCallback, useEffect, useState} from 'react'
import {Modal, ModalProps} from '../common'
import {Button, Grid, Omit, Typography} from '@material-ui/core'
import {PrimaryButton} from '../common/buttons'

const _usePromptModal = () => {
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
const PromptModalContext = React.createContext()

export const PromptModal: React.FC<{ onSubmitClick: () => any } & MProps> = ({children, onSubmitClick, ...props}) => {
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
            <Typography variant='h1'>
                Вы действительно хотите отказаться от участия в мероприятии?
            </Typography>
            <Grid container direction='row' justify='flex-end'
                  style={{marginTop: 32}} spacing={1}>
                <Grid item>
                    <Button style={{color: '#818C99'}} disabled={disabled} onClick={() => {
                        setDisabled(true)
                    }}>
                        Отказаться
                    </Button>
                </Grid>
                <Grid item>
                    <PrimaryButton disabled={disabled} onClick={props.close}>
                        Продолжить участие
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