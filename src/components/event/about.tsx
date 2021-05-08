import React, {useEffect, useState} from 'react'
import {
    AdditionalText,
    FlexSpace,
    GrayishPlate,
    GrayPlate,
    Plate
} from '../common'
import {
    Box,
    CardActionArea,
    Grid,
    IconButton,
    Typography
} from '@material-ui/core'
import {format} from 'date-fns'
import {useAppState} from '../tools/use-app-state'
import {InfoPlate} from '../common/item-plate'
import {CaptionText} from '../common/typography'
import {useEventParticipantsModal} from '../modals/event-participants'
import {getEventSecret} from '../../model/api'
import {copyTextToClipboard} from '../../utils'
import {ReactComponent as CopyIcon} from '../../assets/copy.svg'

export const EventAbout: React.FC = () => {

    const {event, cUser} = useAppState()
    const {open} = useEventParticipantsModal()

    const [secret, setSecret] = useState('')

    useEffect(() => {
        (async () => {
            if (event.founderId === cUser.id && cUser.id !== '-1') {
                const s = await getEventSecret(event.id)
                setSecret(s)
            }
        })()
    }, [event.id, event.founderId, cUser.id])

    return <GrayishPlate padding={16} style={{marginTop: 16}}>
        {event.founderId === cUser.id && cUser.id !== '-1' &&
        <Grid container direction='column'>
          <AdditionalText>
            Ссылка на мероприятие:
          </AdditionalText>
          <Box clone marginBottom={2} marginTop={1}>
            <Plate padding={8} elevation={4}>
              <Grid container alignItems='center'>
                <Typography variant='body1' style={{wordBreak: 'break-all'}}>
                  team-up.online/event/{event.id}{secret ? `?secret=${secret}` : ''}
                </Typography>
                <FlexSpace/>
                <IconButton size='small' onClick={() => {
                    const str = `https://team-up.online/event/${event.id}${secret ? `?secret=${secret}` : ''}`
                    copyTextToClipboard(str)
                }}>
                  <CopyIcon/>
                </IconButton>
              </Grid>
            </Plate>
          </Box>
            {secret && <React.Fragment>
              <AdditionalText>
                Пароль:
              </AdditionalText>
              <Box clone marginBottom={2} marginTop={1}>
                <Plate padding={8} elevation={4}>
                  <Grid container alignItems='center'>
                    <Typography variant='body1'
                                style={{wordBreak: 'break-all'}}>
                        {secret ? secret : ''}
                    </Typography>
                    <FlexSpace/>
                    <IconButton size='small' onClick={() => {
                        copyTextToClipboard(secret)
                    }}>
                      <CopyIcon/>
                    </IconButton>
                  </Grid>
                </Plate>
              </Box>
            </React.Fragment>
            }
        </Grid>
        }
        <Box clone flexDirection={{xs: 'column', md: 'row'}}>
            <Grid container spacing={2}>
                <Grid item container xs spacing={2}>
                    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
                        <Grid item container>
                            <AdditionalText
                                style={{marginRight: 16, width: 140}}>Дата
                                начала:</AdditionalText>
                            <Typography
                                variant='body1'>{event.isNullEvent ? '' : event.settings.start ? format(event.settings.start, 'dd/MM/yyyy в H:mm') : 'Не известна'}</Typography>
                        </Grid>
                    </Box>
                    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
                        <Grid item container wrap='nowrap'>
                            <AdditionalText
                                style={{marginRight: 16, width: 140}}>Дата
                                окончания:</AdditionalText>
                            <Typography
                                variant='body1'>{event.isNullEvent ? '' : event.settings.finish ? format(event.settings.finish, 'dd/MM/yyyy в H:mm') : 'Не известна'}</Typography>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item container xs>
                    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
                        <Grid item container style={{marginBottom: 16}}>
                            <AdditionalText style={{marginRight: 16}}>Размер
                                команды:</AdditionalText>
                            <Typography
                                variant='body1'>{event.isNullEvent ? '' : event.settings.teamSize ? (event.settings.teamSize + ' чел. ') : 'любой'}</Typography>
                        </Grid>
                    </Box>
                    <Grid item container xs>
                        <CardActionArea style={{borderRadius: 8}}
                                        disabled={event.isNullEvent}
                                        onClick={open}>
                            <InfoPlate elevation={4} textPlate={CaptionText}
                                       text={event.isNullEvent ? '' : 'Список участников'}/>
                        </CardActionArea>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </GrayishPlate>

}