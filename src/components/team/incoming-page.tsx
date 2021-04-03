import React, {Fragment} from 'react'
import {
    Box, Divider,
    Grid,
} from '@material-ui/core'
import {AdditionalText, GrayPlate, SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {TeamInvitee} from './team-invitee'
import {PersonInvitee} from './person-invitee'
import {Link} from 'react-router-dom'

export const IncomingPage: React.FC = () => {

    const {invites} = useAppState()

    return <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>Хотят в
            команду</SubTitle>
        <Grid container spacing={3} direction='column'>
            {invites.i.personal.map((u, i) => (
                <Fragment key={i}>
                    <TeamInvitee user={u}/>
                    <Divider light flexItem style={{height: 1}}/>
                </Fragment>
            ))
            }
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
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Желают
            объединиться</SubTitle>
        {invites.i.team.length > 0 && <Grid spacing={2} container item>
            {
                invites.i.team.map((u) => (
                    <PersonInvitee key={u.id} user={u}/>
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