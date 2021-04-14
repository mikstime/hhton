import React, {Fragment} from 'react'
import {
    Box,
    Divider, Grid
} from '@material-ui/core'
import {AdditionalText, GrayPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {PersonDeclined} from './person-declined'
import {TeamDeclined} from './team-declined'

export const HistoryPage: React.FC = () => {

    const {invites} = useAppState()

    return <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>Заблокированные индивидуальные заявки</SubTitle>
        <Grid container spacing={3} direction='column'>
            {invites.h.personal.map((u, i) => (
                <Fragment key={i}>
                    <TeamDeclined user={u}/>
                    <Divider light flexItem style={{height: 1}}/>
                </Fragment>
            ))
            }
        </Grid>
        {!invites.h.personal.length && <GrayPlate style={{marginTop: 16}}>
          <AdditionalText>
            Нет заблокированных заявок.
          </AdditionalText>
        </GrayPlate>
        }
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Заблокированные командные заявки</SubTitle>
        {invites.h.team.length > 0 && <Grid spacing={2} container item>
            {
                invites.h.team.map((u) => (
                    <PersonDeclined key={u.id} user={u}/>
                ))
            }
        </Grid>
        }
        {!invites.h.team.length && <GrayPlate>
          <AdditionalText>
            Нет заблокированных командных заявок
          </AdditionalText>
        </GrayPlate>}
        <Box height='150px' width='100%'/>
    </Grid>
}