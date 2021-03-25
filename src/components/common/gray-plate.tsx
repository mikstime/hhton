import React from 'react'
import {Plate, PlateProps} from './plate'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        backgroundColor: '#F0F2F5',
        padding: '12px 16px 12px 16px',
    },
})
export const GrayishPlate: React.FC<PlateProps> = (props) => {
    const classes = useStyles()
    return <Plate classes={classes} {...props}/>
}

const useStylesGray = makeStyles({
    root: {
        backgroundColor: '#F5F5F5',
        padding: '12px 16px 12px 16px',
    },
})
export const GrayPlate: React.FC<PlateProps> = (props) => {
    const classes = useStylesGray()
    return <Plate classes={classes} {...props}/>
}