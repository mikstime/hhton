import React from 'react'
import {
    Box, Grid
} from '@material-ui/core'
import {AdditionalText, GrayPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {BlockedPersonalInvite, BlockedTeamInvite} from './invite-plates'

export const BlockedPage: React.FC = () => {

    const {invites} = useAppState()

    return <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>Заблокированные индивидуальные
            заявки</SubTitle>
        <Grid container direction='column' wrap='nowrap'>
            {invites.h.personal.map((u, i) => (
                <Box clone paddingTop={1} key={i}>
                    <BlockedPersonalInvite user={u}/>
                </Box>
            ))
            }
        </Grid>
        {!invites.h.personal.length && <GrayPlate style={{marginTop: 16}}>
          <AdditionalText>
            Нет заблокированных заявок.
          </AdditionalText>
        </GrayPlate>
        }
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>
            Заблокированные командные заявки
        </SubTitle>
        <Grid container direction='column' wrap='nowrap'>
            {invites.h.team.length > 0 &&
            invites.h.team.map((u) => (
                <Box clone paddingTop={1} key={u.id}>
                    <BlockedTeamInvite user={u}/>
                </Box>
            ))
            }
        </Grid>
        {!invites.h.team.length && <GrayPlate>
          <AdditionalText>
            Нет заблокированных командных заявок
          </AdditionalText>
        </GrayPlate>}
        <Box height='150px' width='100%'/>
    </Grid>
}