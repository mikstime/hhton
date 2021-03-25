import React from 'react'
import {Button, ButtonProps, makeStyles} from '@material-ui/core'
import {AdditionalText} from '../common'

const useStyles = makeStyles({
    button: {
        '&:hover': {
            backgroundColor: 'transparent',
        }
    },
    text: {
        fontSize: 13,
        textTransform: 'none',
    }
})
export const InviteButton: React.FC<ButtonProps> = ({children, ...rest}) => {
    const classes = useStyles()
    return <Button {...rest} className={classes.button + (rest.className ? ' ' + rest.className:  '')}>
        <AdditionalText className={classes.text}>
            {children}
        </AdditionalText>
    </Button>
}