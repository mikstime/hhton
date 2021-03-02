import React from 'react'
import {ButtonProps, Container, Grid, Typography} from '@material-ui/core'
import {
    AvatarPlate,
    Title, FlexSpace
} from '../common'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {CaptionText, SecondaryText} from '../common/typography'
import {InfoPlate, JobPlate} from '../common/item-plate'
import Image from 'material-ui-image'
import {SecondaryButton} from '../common/buttons'

const EventNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 279px;
`

const StyledImage = styled(Image)`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 0 !important;
  display: flex;
`
const RootContainer = styled(Container)`
  min-height: 100vh;
`

const Root = styled.div`
  width: 100%;
  height: 100%;
`

const LogoButton: React.FC<ButtonProps> = (props) => {
    const {event} = useAppState()
    return <SecondaryButton disabled={event.isFinished}>
        Участвовать
    </SecondaryButton>
}
export const EventApp: React.FC = () => {

    const {event} = useAppState()

    return <Root>
        <RootContainer>
            <Grid container style={{position: 'relative'}}>
                <Grid style={{zIndex: 3}} container direction='column'>
                    <Grid item container spacing={2}>
                        <Grid item container md={4}>
                            <AvatarPlate styledButton={LogoButton}
                                         src={event.logo}/>
                        </Grid>
                        <Grid item container md spacing={3} direction='column'>
                            <EventNameGrid item>
                                <Typography>
                                    {event.name}
                                </Typography>
                            </EventNameGrid>
                            <Grid style={{height: 130}} item/>
                            <Grid item>
                                <JobPlate elevation={4}
                                          text='Подробная информация'/>
                            </Grid>
                            <Grid item>
                                <InfoPlate elevation={4} textPlate={CaptionText}
                                           text='Подробная информация'/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item container direction='column' md>
                            <Grid item>
                                <Title>
                                    О мероприятии
                                </Title>
                            </Grid>
                            <Grid item>
                                <SecondaryText>
                                    123
                                </SecondaryText>
                            </Grid>
                        </Grid>
                        <Grid item xs md={5}/>
                    </Grid>
                </Grid>
            </Grid>
        </RootContainer>
    </Root>
}