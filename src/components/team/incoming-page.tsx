import React from 'react'
import {
    Box, Grid
} from '@material-ui/core'
import {AdditionalText, GrayPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {PersonInvitee} from './person-invitee'
import {Link} from 'react-router-dom'
import {IncomingPersonalInvite, IncomingTeamInvite} from './invite-plates'

export const IncomingPage: React.FC = () => {

    const {invites} = useAppState()

    return <Grid container direction='column'>
        <SubTitle>Заявки от пользователей</SubTitle>
        <Grid container direction='column' wrap='nowrap'>
            {invites.i.personal.map((u, i) => <Box clone paddingTop='8px'
                                                   key={i}>
                <IncomingPersonalInvite user={u}/></Box>)}
        </Grid>
        {!invites.i.personal.length && <GrayPlate style={{marginTop: 16}}>
          <AdditionalText>
            Пока нет активных заявок. Попробуйте проявить инициативу и <Link
            style={
                {textDecoration: 'none'}
            } to='/feed'>пригласить первым</Link>
          </AdditionalText>
        </GrayPlate>
        }
        <SubTitle style={{marginBottom: 24, marginTop: 8}}>Заявки от команд</SubTitle>
        {invites.i.team.length > 0 && <Grid spacing={2} container item>
            {
                invites.i.team.map((u) => (
                    <IncomingTeamInvite key={u.id} user={u}/>
                ))
            }
        </Grid>
        }
        {!invites.i.team.length && <GrayPlate>
          <AdditionalText>
            Сейчас нет команд, которые бы хотели объединиться.
          </AdditionalText>
        </GrayPlate>}
        <Box height='150px' width='100%'/>
    </Grid>
}