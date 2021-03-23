import React from 'react'
import {CardActionArea, createStyles, makeStyles} from '@material-ui/core'
import cameraIcon from '../../assets/camera.svg'

const useStyles = makeStyles(createStyles({
    card: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 2,
        borderRadius: 4,
        '&:hover div': {
            opacity: 1,
            width: '100%',
            height: '100%',
            backgroundImage: `url("${cameraIcon}")`,
            backgroundSize: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }
    },
    div: {
        opacity: 0,
        transition: '.3s opacity'
    }
}))
export const EditableImage: React.FC<{
    onClick?: React.MouseEventHandler<HTMLDivElement>
}> = ({children, onClick}) => {

    const classes = useStyles()
    return <div style={{position: 'relative'}}>
        <CardActionArea className={classes.card}>
            <div className={classes.div} onClick={onClick}/>
        </CardActionArea>
        {children}
    </div>
}