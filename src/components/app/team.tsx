import React from 'react'
import {
    Box,
    Grid, Grow
} from '@material-ui/core'
import {SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {TeamMember} from '../team/team-member'
import {TeamInvitee} from '../team/team-invitee'
import {PersonInvitee} from '../team/person-invitee'


export const TeamApp: React.FC = () => {

    const {cUser, invites} = useAppState()
    return <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>{(cUser.team && cUser.team.name) || 'Ваша комнада'}</SubTitle>
        <Grid container spacing={3} direction='column'>
            {cUser.team && cUser.team.members.map((u, i) => (
                <Grow key={i} in><TeamMember user={u}/></Grow>
            ))
            }
            {(!cUser.team || !cUser.team.members.length) && <Grow in><TeamMember user={cUser}/></Grow>}
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Хотят в
            команду</SubTitle>
        <Grid container spacing={3} direction='column'>
            {invites.personal.map((u, i) => (
                <TeamInvitee key={i} user={u}/>
            ))
            }
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Приглашают к
            себе</SubTitle>
        {invites.team && <Grid spacing={2} container item>
            {
                invites.team.map((u) => (
                    <PersonInvitee key={u.id} user={u}/>
                ))
            }
        </Grid>
        }
        <Box height='150px' width='100%'/>
    </Grid>
}