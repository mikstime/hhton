import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {Prize} from '../tools/use-app-state/user'
import {AdditionalText} from '../common'
import {useAppState} from '../tools/use-app-state'

export const PrizePool: React.FC<{ prizes: Prize[] }> = ({prizes}) => {

    const {event} = useAppState()
    const toRender = prizes.map((p, i) => (
        <Grid item key={i}>
            <Typography variant='body2' style={{
                listStyleType: 'circle',
                marginTop: 16,
            }}>
                {i + 1} место: {p.name} {Number(p.total) > 1 ? `${p.name ? '–' : ''} x${p.total}` : ''}
            </Typography>
        </Grid>
    ))
    if(toRender.length > 0) {
        return <Grid item container direction='column'
                     style={{marginTop: 8}}>
            {toRender}
        </Grid>
    }
    if(event.isNullEvent) {
        return null
    }
    return <Grid container direction='column'
                 style={{marginTop: 8}}>
        <AdditionalText>
            Мероприятие не имеет призового фонда.
        </AdditionalText>
    </Grid>
}