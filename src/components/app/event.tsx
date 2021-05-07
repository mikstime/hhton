import React, {useCallback, useEffect} from 'react'
import {
    Box,
    Grid, Grow,
    Hidden,
    Typography, TypographyProps
} from '@material-ui/core'
import {
    AdditionalText,
    AvatarPlate,
    Title
} from '../common'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {CaptionText, SecondaryText} from '../common/typography'
import {InfoPlate, JobPlate} from '../common/item-plate'
import {ParticipateButton} from '../event/participate-button'
import {useHistory, useParams} from 'react-router'
import {NotFound} from './notfound'
import notFoundIcon from '../../assets/notfound.svg'
import Image from 'material-ui-image'
import {EditEventButton} from '../event/edit-event-button'
import {EditableImage} from '../common/editable-image'
import {editEventBackground, editEventLogo} from '../tools/edit-images'
import {useSnackbar} from 'notistack'
import {WinnersSection} from '../event/winners'
import {PrizePool} from '../event/prizepool'
import {EventAbout} from '../event/about'

const EventNameGrid = styled(Grid)`
  padding: 12px 0 0 12px !important;
`
const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

function validURL(str: string) {
    return pattern.test(str)
}

const assurePrefix = (link: string) => (link.indexOf('://') === -1) ? 'https://' + link : link

const CaptionLink: (to: string) => React.FC<TypographyProps> = (to) => (props) => {
    if (validURL(to)) {
        return <a target="_blank" href={assurePrefix(to)}
                  style={{textDecoration: 'none', wordBreak: 'break-all'}}><CaptionText {...props}/></a>
    }
    if (!to) {
        return <AdditionalText {...props}/>
    }
    return <CaptionText {...props}/>
}
export const EventApp: React.FC = () => {
    //@ts-ignore
    const {eventId} = useParams()
    const {event, cEvent, cUser} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()

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
            } else {
                history.push('/')
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
                                        borderRadius: '10px',
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
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    paddingTop: '250px'
                                }}/>
                            }
                        </Grid>
                        <Grid item style={{marginTop: -120}}/>
                    </Hidden>
                    <Grid item container style={{zIndex: 2}}>
                        <JobPlate elevation={4}
                                  text={!event.isNullEvent ? `Место проведения: ${event.place || 'не указано'}` : ''}/>
                    </Grid>
                    <Grid item container style={{zIndex: 2}}>
                        <InfoPlate gray
                                   textPlate={CaptionLink(event.settings.site ?? '')}
                                   elevation={4}
                                   text={!event.isNullEvent ? `${event.settings.site || 'Сайт мероприятия не указан'}` : ''}/>
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
                    <Grid item lang='ru'>
                        <SecondaryText style={{hyphens: 'auto'}}>
                            {event.description || ''}
                        </SecondaryText>
                    </Grid>
                    <EventAbout/>
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