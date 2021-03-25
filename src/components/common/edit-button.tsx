import React from 'react'
import {Box, Button, ButtonProps, makeStyles} from '@material-ui/core'
import {ReactComponent as SettingsIcon} from '../../assets/settings.svg'
const useStyles = makeStyles({
    root: {
        background: 'white',
        height: 24,
        fontSize: 12,
        textDecoration: 'underline',
        textIndent: 5,
        textTransform: 'none',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        marginLeft: 12,
        borderRadius: 8,
    }
})
export const EditButton: React.FC<ButtonProps> = (props) => {
    const classes = useStyles()
    return <Button classes={classes} {...props}>
        <Box clone >
        <SettingsIcon/>
        </Box>
        Редактировать
    </Button>
}