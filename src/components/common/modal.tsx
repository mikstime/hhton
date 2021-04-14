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
        outline: 'none',
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
                <Grid container {...gridProps}
                      style={
                          {
                              overflowY: 'auto',
                              maxHeight: '100vh',
                              ...(gridProps.style || {})
                          }}>
                    <Hidden xsDown>
                        <Grid item xs/>
                    </Hidden>
                    <Box clone paddingTop={{sm: '100px'}} order={{xs: 2, sm: 1}}>
                        <Grid style={{
                            position: 'sticky',
                            height: 52, width: 52, top: 0,
                        }} item>
                            {canGoBack &&
                            <IconButton onClick={back}>
                              <BackIcon/>
                            </IconButton>
                            }
                        </Grid>
                    </Box>
                    <Box clone order={{xs: 3, sm: 2}} paddingBottom={'100px'}>
                        <Grid item xs={12} sm={9} md={7} lg={6} container
                              direction='column'
                              style={{zIndex: 3}}>
                            <Box height={{xs: 0, sm: 100}}/>
                            <Plate elevation={4} padding={32}>
                                {children}
                            </Plate>
                            <Box height={{xs: 0, sm: 100}}/>
                        </Grid>
                    </Box>
                    <Box clone paddingBottom={{xs: '0', sm: '0'}}
                         paddingTop={{xs: '0', sm: '100px'}}
                         order={{xs: 1, sm: 3}}
                    >
                        <Grid style={{
                            height: 52, position: 'sticky',
                            width: 52, top: 0
                        }} item>
                            {!cantClose &&
                            <IconButton onClick={close}>
                              <CloseIcon/>
                            </IconButton>
                            }
                        </Grid>
                    </Box>
                    <Hidden xsDown>
                        <Grid item xs/>
                    </Hidden>
                </Grid>
            </div>
        </Grow>
    </ModalBase>
}