import React from 'react'
import {Button, ButtonProps} from '@material-ui/core'

export const PrimaryButton: React.FC<ButtonProps> = ({children, ...rest}) => {
    return <Button variant={'contained'} color='primary' {...rest}>
        {children}
    </Button>
}

export const SecondaryButton: React.FC<ButtonProps> = ({children, style, ...rest}) => {
    return <Button style={{color: 'white', ...style}} variant={'contained'}
                   color='secondary' {...rest}>
        {children}
    </Button>
}