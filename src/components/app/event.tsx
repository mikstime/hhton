import React, {useCallback, useEffect} from 'react'
import {
    Box,
    CardActionArea,
    Grid, Grow,
    Hidden,
    Typography
} from '@material-ui/core'
import {
    AvatarPlate,
    Title
} from '../common'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {CaptionText, SecondaryText} from '../common/typography'
import {InfoPlate, JobPlate} from '../common/item-plate'
import {ParticipateButton} from '../event/participate-button'
import {useParams} from 'react-router'
import {NotFound} from './notfound'
import notFoundIcon from '../../assets/notfound.svg'
import Image from 'material-ui-image'
import {EditEventButton} from '../event/edit-event-button'
import {useEventAboutModal} from '../modals/event-about'
import {EditableImage} from '../common/editable-image'
import {editEventBackground, editEventLogo} from '../tools/edit-images'
import {useSnackbar} from 'notistack'
import {WinnersSection} from '../event/winners'
import {PrizePool} from '../event/prizepool'

const EventNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`

export const EventApp: React.FC = () => {
    //@ts-ignore
    const {eventId} = useParams()
    const {event, cEvent, cUser} = useAppState()
    const {open} = useEventAboutModal()
    const {enqueueSnackbar} = useSnackbar()

    const onLogoChange = useCallback(() => {
        editEventLogo(event.id).then(result => {
            if (!result) {
                enqueueSnackbar('Не удалось обновить логотип', {
                    variant: 'error'
                })
            } else {
                cEvent.change({logo: result})
                event.change({logo: result})
            }
        })
    }, [cEvent, event])

    const onBackgroundChange = useCallback(() => {
        editEventBackground(event.id).then(result => {
            if (!result) {
                enqueueSnackbar('Не удалось обновить фон', {
                    variant: 'error'
                })
            } else {
                cEvent.change({background: result})
                event.change({background: result})
            }
        })
    }, [cEvent, event])

    useEffect(() => {
        if (eventId) {
            event.change({id: eventId})
        } else {
            if (cEvent.id !== '-1') {
                event.change({id: cEvent.id})
            }
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

    return <Grid container style={{position: 'relative'}}>
        <Grid style={{zIndex: 3}} container direction='column'>
            <Grid item container spacing={2}>
                <Grid item container md={5}>
                    <AvatarPlate src={event.logo}
                                 onEdit={onLogoChange}
                                 editable={event.founderId === cUser.id}>
                        <ParticipateButton/>
                    </AvatarPlate>
                </Grid>
                <Grid item container md spacing={2} direction='column'>
                    <EventNameGrid item container alignItems='center'>
                        <Typography style={{minHeight: 24}}>
                            {event.name}
                        </Typography>
                        <Box clone marginLeft='12px'>
                            <EditEventButton/>
                        </Box>
                    </EventNameGrid>
                    <Hidden smDown>
                        <Grid item style={{paddingLeft: 20, paddingRight: 20}}>
                            {event.founderId === cUser.id ?
                                <EditableImage onClick={onBackgroundChange}>
                                    <Image src={event.background} imageStyle={{
                                        width: '100%',
                                        objectFit: 'cover',
                                        height: '250px'
                                    }} style={{
                                        width: '100%',
                                        borderRadius: '10px 10px 0 0',
                                        overflow: 'hidden',
                                        paddingTop: '250px'
                                    }}/>
                                </EditableImage> :
                                <Image src={event.background} imageStyle={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    height: '250px'
                                }} style={{
                                    width: '100%',
                                    borderRadius: '10px 10px 0 0',
                                    overflow: 'hidden',
                                    paddingTop: '250px'
                                }}/>
                            }
                        </Grid>
                        <Grid item style={{marginTop: -120}}/>
                    </Hidden>
                    <Grid item style={{zIndex: 2}}>
                        <JobPlate elevation={4}
                                  text={event.place ? `Место проведения: ${event.place}` : ''}/>
                    </Grid>
                    <Grid item style={{zIndex: 2}}>
                        <CardActionArea style={{borderRadius: 8}}
                                        onClick={open}>
                            <InfoPlate elevation={4} textPlate={CaptionText}
                                       text='Подробная информация'/>
                        </CardActionArea>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container>
                <Grid item container direction='column' md>
                    <Grid item>
                        <Title>
                            О мероприятии
                            {!event.isFinished && <Hidden smDown>
                              <Box clone marginLeft='12px'>
                                <EditEventButton/>
                              </Box>
                            </Hidden>
                            }
                        </Title>
                    </Grid>
                    <Grid item>
                        <SecondaryText>
                            {event.description || 'Похоже, информация о мероприятии отсутствует'}
                        </SecondaryText>
                    </Grid>
                </Grid>
            </Grid>
            {
                event.isFinished &&
                <Grow in><Grid item container direction='column'>
                  <Grid item style={{marginBottom: 24}}>
                    <Title>
                      Победители
                      <Hidden smDown>
                        <Box clone marginLeft='12px'>
                          <EditEventButton/>
                        </Box>
                      </Hidden>
                    </Title>
                  </Grid>
                  <WinnersSection/>
                </Grid>
                </Grow>
            }
            <Grid item container>
                <Grid item container direction='column' md>
                    <Grid item>
                        <Title>
                            Призовой фонд
                        </Title>
                    </Grid>
                    <Grid item>
                        <PrizePool prizes={event.prizes}/>
                    </Grid>
                    <div style={{height: 32}}/>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}