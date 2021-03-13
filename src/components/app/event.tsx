import React, {useEffect} from 'react'
import {Container, Grid, Typography} from '@material-ui/core'
import {
    AvatarPlate,
    Title,
} from '../common'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {CaptionText, SecondaryText} from '../common/typography'
import {InfoPlate, JobPlate} from '../common/item-plate'
import {ParticipateButton} from '../event/participate-button'
import {useParams} from 'react-router'
import {NotFound} from './notfound'
import notFoundIcon from '../../assets/notfound.svg'

const EventNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`

// const Background = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   height: 279px;
// `
//
// const StyledImage = styled(Image)`
//   position: absolute;
//   z-index: 0;
//   top: 0;
//   left: 0;
//   right: 0;
//   padding-top: 0 !important;
//   display: flex;
// `
const RootContainer = styled(Container)`
  min-height: calc(100vh - 70px);
  margin-top: 70px;
`

const Root = styled.div`
  width: 100%;
  height: 100%;
`

export const EventApp: React.FC = () => {
    //@ts-ignore
    const {eventId} = useParams()
    const {event, cEvent} = useAppState()

    useEffect(() => {
        if (eventId) {
            event.change({id: eventId})
        } else {
            event.change({id: cEvent.id})
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, cEvent.id])

    if (event.notFound) {
        return <NotFound
            title='Мероприятие не найдено'
            message='Попробуйте поискать в другом месте'
            icon={notFoundIcon}
        />
    }

    return <Root>
        <RootContainer>
            <Grid container style={{position: 'relative'}}>
                <Grid style={{zIndex: 3}} container direction='column'>
                    <Grid item container spacing={2}>
                        <Grid item container md={4}>
                            <AvatarPlate src={event.logo}>
                                <ParticipateButton/>
                            </AvatarPlate>
                        </Grid>
                        <Grid item container md spacing={3} direction='column'>
                            <EventNameGrid item>
                                <Typography style={{minHeight: 24}}>
                                    {event.name}
                                </Typography>
                            </EventNameGrid>
                            <Grid style={{height: 130}} item/>
                            <Grid item>
                                <JobPlate elevation={4}
                                          text={event.place ? `Место проведения: ${event.place}`: ''}/>
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