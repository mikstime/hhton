import React from 'react'
import {Button, makeStyles} from '@material-ui/core'
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
export const InviteButton = () => {
    const classes = useStyles()
    return <Button className={classes.button}>
        <AdditionalText className={classes.text}>
            Я знаю, кого позвать
        </AdditionalText>
    </Button>
}