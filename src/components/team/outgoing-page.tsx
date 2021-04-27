import React, {Fragment} from 'react'
import {
    Box, Divider,
    Grid
} from '@material-ui/core'
import {AdditionalText, GrayPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {Link} from 'react-router-dom'
import {OutgoingPersonalInvite, OutgoingTeamInvite} from './invite-plates'

export const OutgoingPage: React.FC = () => {

    const {invites} = useAppState()

    return <Grid container direction='column'>
        <SubTitle>Предложения людям</SubTitle>
        <Grid container direction='column' wrap='nowrap'>
            {invites.o.personal.map((u, i) => (
                <Box clone paddingTop={1} key={i}>
                    <OutgoingPersonalInvite user={u}/>
                </Box>
            ))
            }
        </Grid>
        {!invites.o.personal.length && <GrayPlate style={{marginTop: 16}}>
          <AdditionalText>
            Нет исходящих заявок. <Link
            style={
                {textDecoration: 'none'}
            } to='/feed'>Умный поиск</Link>
          </AdditionalText>
        </GrayPlate>
        }
        <SubTitle style={{marginBottom: 8, marginTop: 16}}>Предложения
            командам</SubTitle>
        <Grid container direction='column' wrap='nowrap'>
            {invites.o.team.length > 0 &&
            invites.o.team.map((u) => (
                <Box key={u.id} clone paddingTop={1}>
                <OutgoingTeamInvite user={u}/>
                </Box>
            ))
            }
        </Grid>
        {!invites.o.team.length && <GrayPlate>
          <AdditionalText>
            Вы не предложили объединение ни одной из команд
          </AdditionalText>
        </GrayPlate>}
        <Box height='150px' width='100%'/>
    </Grid>
}