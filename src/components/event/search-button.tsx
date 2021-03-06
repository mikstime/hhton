import React from 'react'
import {
    Card,
    CardActionArea, CardProps,
    Grid,
    makeStyles,
    Typography
} from '@material-ui/core'
import rocketIcon from '../../assets/rocket.svg'
import Image from 'material-ui-image'

const useStyles = makeStyles({
    root: {
        borderRadius: 8,
        padding: 16,
        background: 'linear-gradient(#3574ED, #4E7CD6)',
        overflow: 'visible'
    },
    h1: {
        fontSize: 22,
        color: 'white'
    },
    action: {
        borderRadius: 8,
        marginTop: 32
    }
})
export const SearchButton: React.FC<CardProps> = ({classes, ...props}) => {
    const classes1 = useStyles()
    return <CardActionArea className={classes1.action}>
        <Card classes={{
            root: classes1.root,
            ...classes,
        }} elevation={4} {...props}>
            <Grid container wrap='nowrap' alignItems='center'>
                <Grid item xs>
                    <Typography className={classes1.h1} variant='h1'>
                        Использовать умный поиск
                    </Typography>
                </Grid>
                <Image src={rocketIcon} style={{
                    paddingTop: 58, background: 'transparent',
                    width: 36
                }} imageStyle={{
                    width: 36,
                    height: 86
                }}/>
            </Grid>
        </Card>
    </CardActionArea>
}