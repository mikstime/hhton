import React from 'react'
import {
    Box,
    Grid, GridProps, Grow, Hidden, IconButton, makeStyles,
    Modal as ModalBase,
    ModalProps as ModalBaseProps
} from '@material-ui/core'
import {FlexSpace} from './reusable'
import {Plate} from './plate'
import {ReactComponent as CloseIcon} from '../../assets/close.svg'
import {ReactComponent as BackIcon} from '../../assets/back.svg'


export interface ModalProps extends ModalBaseProps {
    close?: React.MouseEventHandler,
    back?: React.MouseEventHandler,
    gridProps?: GridProps,
    canGoBack?: boolean,
    cantClose?: boolean,
}

const useStyles = makeStyles({
    modal: {
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:focus': {
            outline: 'none'
        }
    }
})

export const Modal: React.FC<ModalProps> = ({children, canGoBack, cantClose, gridProps = {}, close, back, ...props}) => {
    const classes = useStyles()
    return <ModalBase {...props}>
        <Grow in={props.open}>
            <div className={classes.modal}>
                <FlexSpace/>
                <Box clone order={{
                }}>
                <Grid container {...gridProps}
                      style={
                          {
                              overflowY: 'auto',
                              maxHeight: '90vh',
                              marginTop: '10vh',
                              paddingBottom: '10vh',
                              ...(gridProps.style || {})
                          }}>
                    <Hidden xsDown>
                        <Grid item xs/>
                    </Hidden>
                    <Grid style={{
                        position: 'sticky',
                        height: 52, width: 52, top: 0
                    }} item>
                        {canGoBack &&
                        <IconButton onClick={back}>
                          <BackIcon/>
                        </IconButton>
                        }
                    </Grid>
                    <Grid item xs={12} sm={9} md={7} lg={6}>
                        <Plate elevation={4} padding={32}>
                            {children}
                        </Plate>
                    </Grid>
                    <Grid style={{
                        position: 'sticky', height: 52,
                        width: 52, top: 0
                    }} item>
                        { !cantClose &&
                            <IconButton onClick={close}>
                                <CloseIcon/>
                            </IconButton>
                        }
                    </Grid>
                    <Grid item xs/>
                </Grid>
                </Box>
                <FlexSpace/>
            </div>
        </Grow>
    </ModalBase>
}