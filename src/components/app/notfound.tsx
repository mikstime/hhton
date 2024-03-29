import React from 'react'
import {AdditionalText, FlexSpace, Plate, Title} from '../common'
import {Box, Container, Grid, Hidden} from '@material-ui/core'
import Image from 'material-ui-image'
import {PrimaryButton} from '../common/buttons'
import {Link} from 'react-router-dom'

export const NotFound: React.FC<{
    title: string,
    message: string,
    icon: string,
}> = ({title, message, icon}) => {
    return <Container style={{
        height: 'calc(100vh - 64px)',
        minHeight: 400,
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        justifyContent: 'center'
    }}>
        <FlexSpace/>
        <Plate elevation={4} padding={32}>
            <Grid container style={{maxWidth: 500}}>
                <Grid style={{paddingLeft: 16}} item container
                      direction='column'>
                    <Title>
                        {title}
                    </Title>
                    <AdditionalText style={{marginTop: 8}}>
                        {message}
                    </AdditionalText>
                    <FlexSpace/>
                    <Grid item container justify='flex-end'
                          style={{marginTop: 16}}>
                        <Link to='/home' style={{textDecoration: 'none'}}>
                            <PrimaryButton>
                                На главную
                            </PrimaryButton>
                        </Link>
                    </Grid>
                </Grid>
                <Hidden xsDown>
                <Grid item style={{marginBottom: -192, marginLeft: -64}}>
                    <Image src={icon}
                           color='transparent'
                           imageStyle={{width: 192, height: 192}}
                           style={{width: 192, paddingTop: 192}}/>
                </Grid>
                </Hidden>
            </Grid>
        </Plate>
        <Box height='100%'/>
        <FlexSpace/>
    </Container>
}