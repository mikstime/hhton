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

export const OutgoingPage: React.FC = () => {

    const {invites} = useAppState()

    return <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>Предложения людям</SubTitle>
        <Grid container spacing={3} direction='column'>
            {invites.personal.map((u, i) => (
                <Fragment key={i}>
                    <TeamInvitee user={u}/>
                    <Divider light flexItem style={{height: 1}}/>
                </Fragment>
            ))
            }
        </Grid>
        {!invites.personal.length && <GrayPlate style={{marginTop: 16}}>
          <AdditionalText>
            Нет исходящих заявок. <Link
            style={
                {textDecoration: 'none'}
            } to='/feed'>Умный поиск</Link>
          </AdditionalText>
        </GrayPlate>
        }
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Предложения
            командам</SubTitle>
        {invites.team.length > 0 && <Grid spacing={2} container item>
            {
                invites.team.map((u) => (
                    <PersonInvitee key={u.id} user={u}/>
                ))
            }
        </Grid>
        }
        {!invites.team.length && <GrayPlate>
          <AdditionalText>
            Вы не предложили объединение ни одной из команд
          </AdditionalText>
        </GrayPlate>}
        <Box height='150px' width='100%'/>
    </Grid>
}