import React, {Fragment, useEffect} from 'react'
import {
    Box, Divider,
    Grid, Grow
} from '@material-ui/core'
import {SubTitle} from '../common'
import {useAppState} from '../tools/use-app-state'
import {TeamMember} from '../team/team-member'
import {TeamInvitee} from '../team/team-invitee'
import {PersonInvitee} from '../team/person-invitee'
import {useHistory} from 'react-router-dom'

export const TeamApp: React.FC = () => {

    const {cUser, invites} = useAppState()
    const history = useHistory()

    useEffect(() => {
        if(cUser.isNotAuthorized) {
            history.push('/')
        }
    }, [cUser.isNotAuthorized])

    return <Grid container direction='column'>
        <SubTitle style={{marginBottom: 24}}>{(cUser.team && cUser.team.name) || 'Ваша комнада'}</SubTitle>
        <Grid container spacing={3} direction='column'>
            {cUser.team.members.length > 0 && cUser.team.members.map((u, i) => {
                return <Fragment key={i}>
                    <Grow in><TeamMember user={u}/></Grow>
                    <Divider light flexItem style={{height: 1}}/>
                </Fragment>
            })
            }
            {!cUser.team.members.length && <Fragment>
              <Grow in><TeamMember user={cUser}/></Grow>
              <Divider light flexItem style={{height: 1}}/>
            </Fragment>}
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Хотят в
            команду</SubTitle>
        <Grid container spacing={3} direction='column'>
            {invites.personal.map((u, i) => (
                <Fragment key={i}>
                <TeamInvitee user={u}/>
                    <Divider light flexItem style={{height: 1}}/>
                </Fragment>
            ))
            }
        </Grid>
        <SubTitle style={{marginBottom: 24, marginTop: 36}}>Желают объединиться</SubTitle>
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