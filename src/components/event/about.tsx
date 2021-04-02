import React from 'react'
import {AdditionalText, GrayishPlate} from '../common'
import {Box, CardActionArea, Grid, Typography} from '@material-ui/core'
import {format} from 'date-fns'
import {useAppState} from '../tools/use-app-state'
import {InfoPlate} from '../common/item-plate'
import {CaptionText} from '../common/typography'
import {useEventParticipantsModal} from '../modals/event-participants'

export const EventAbout: React.FC = () => {

    const {event} = useAppState()
    const {open} = useEventParticipantsModal()
    if (!event.settings.start && !event.settings.finish && !event.settings.teamSize) {
        return null
    }
    return <GrayishPlate padding={16} style={{marginTop: 16}}>
        <Box clone flexDirection={{xs: 'column', md: 'row'}}>
            <Grid container spacing={2}>
                <Grid item container xs spacing={2}>
                    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
                        <Grid item container>
                            <AdditionalText
                                style={{marginRight: 16}}>Дата
                                начала:</AdditionalText>
                            <Typography
                                variant='body1'>{event.settings.start ? format(event.settings.start, 'dd/MM/yyyy в hh:mm') : 'Не известна'}</Typography>
                        </Grid>
                    </Box>
                    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
                        <Grid item container wrap='nowrap'>
                            <AdditionalText
                                style={{marginRight: 16}}>Дата
                                окончания:</AdditionalText>
                            <Typography
                                variant='body1'>{event.settings.finish ? format(event.settings.finish, 'dd/MM/yyyy в hh:mm') : 'Не известна'}</Typography>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item container xs spacing={2}>
                    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
                        <Grid item container>
                            <AdditionalText style={{marginRight: 16}}>Размер
                                команды:</AdditionalText>
                            <Typography
                                variant='body1'>{event.settings.teamSize ? (event.settings.teamSize + ' чел. ') : 'любой'}</Typography>
                        </Grid>
                    </Box>
                    <Grid item container>
                        <CardActionArea style={{borderRadius: 8}}
                                        onClick={open}>
                            <InfoPlate elevation={4} textPlate={CaptionText}
                                       text='Список участников'/>
                        </CardActionArea>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </GrayishPlate>

}