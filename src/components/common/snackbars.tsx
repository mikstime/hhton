import React, {useState, forwardRef, useCallback} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useSnackbar, SnackbarContent} from 'notistack'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '344px !important'
        }
    },
    card: {
        // backgroundColor: '#fddc6c',
        width: '100%',
        boxShadow: theme.shadows[4]
    },
    typography: {
        fontWeight: 'bold'
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        justifyContent: 'space-between'
    },
    icons: {
        marginLeft: 'auto'
    },
    expand: {
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    collapse: {
        padding: 16
    },
    checkIcon: {
        fontSize: 20,
        color: '#b3b3b3',
        paddingRight: 4
    },
    button: {
        padding: 0,
        textTransform: 'none'
    }
}))

const SnackMessage = forwardRef<HTMLDivElement, { id: string | number, message: string | React.ReactNode, to?: string }>((props, ref) => {
    const classes = useStyles()
    const {closeSnackbar} = useSnackbar()
    // console.log(props)
    const handleDismiss = useCallback(() => {
        closeSnackbar(props.id)
    }, [props.id, closeSnackbar])

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card}>
                <CardActions classes={{root: classes.actionRoot}}>
                    <Typography>

                    </Typography>
                    {props.to ? <Link to={props.to} style={{
                            textDecoration: 'none',
                            color: '#222222'
                        }} onClick={handleDismiss}>
                            <Typography variant="subtitle2"
                                        className={classes.typography}>{props.message}</Typography>
                        </Link> :
                        <Typography variant="subtitle2"
                                    className={classes.typography}>{props.message}</Typography>
                    }

                    <div className={classes.icons}>
                        <IconButton className={classes.expand}
                                    onClick={handleDismiss}>
                            <CloseIcon/>
                        </IconButton>
                    </div>
                </CardActions>
            </Card>
        </SnackbarContent>
    )
})

export default SnackMessage