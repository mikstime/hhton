import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {Prize} from '../tools/use-app-state/user'
import {AdditionalText} from '../common'

export const PrizePool: React.FC<{ prizes: Prize[] }> = ({prizes}) => {

    const toRender = prizes.map((p, i) => (
        <Grid item key={i}>
            <Typography variant='body2' style={{
                listStyleType: 'circle',
                marginTop: 16,
            }}>
                {i + 1}. {p.name} - {p.total}шт.
            </Typography>
        </Grid>
    ))
    if(toRender.length > 0) {
        return <Grid item container direction='column'
                     style={{marginTop: 24}}>
            {toRender}
        </Grid>
    }
    return <Grid container direction='column'
                 style={{marginTop: 24}}>
        <AdditionalText>
            Мероприятие не имеет призового фонда.
        </AdditionalText>
    </Grid>
}