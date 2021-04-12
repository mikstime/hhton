import React, {Fragment} from 'react'
import {
    Box, Button, Divider,
    Grid, Grow
} from '@material-ui/core'
import {AdditionalText, GrayPlate} from '../common'
import {useAppState} from '../tools/use-app-state'
import {TeamMember} from './team-member'
import {Link} from 'react-router-dom'
import {TeamName} from './team-name'
import {leaveTeam} from '../../model/api'
import {useSnackbar} from 'notistack'
import {useNotificationHandlers} from '../tools/notification-handlers'

const LeaderSection: React.FC = () => {

    const {cUser} = useAppState()

    if (!cUser.team.teamLead) {
        return null
    }

    if (cUser.team.teamLead.id === cUser.id) {
        return <AdditionalText>
            <b>Вы</b> – лидер команды
        </AdditionalText>
    }

    if (cUser.team.teamLead.id !== cUser.id) {
        return <AdditionalText>
            <b>{cUser.team.teamLead.firstName} {cUser.team.teamLead.lastName}</b> –
            лидер команды
        </AdditionalText>
    }

    return null
}

export const TeamPage: React.FC = () => {

    const {cUser, cEvent} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    return <Grid container direction='column'>
        <Grid item container alignItems='baseline'>
            <TeamName/>
            <Box flex={1}/>
            <LeaderSection/>
        </Grid>
        <GrayPlate style={{marginBottom: 16}}>
            <AdditionalText>
                Это ваша команда на мероприятии&nbsp;
                <Link style={{textDecoration: 'none'}}
                      to={`/event/${cEvent.id}`}>
                    {cEvent.name}
                </Link>. По окончании отбора состав команды автоматически
                утвердится.
                <br/><br/>
                А пока что можете найти человека или команду при помощи <Link
                to='/feed' style={
                {textDecoration: 'none'}
            }>умного поиска</Link>
            </AdditionalText>
        </GrayPlate>
        <Grid container spacing={3} direction='column'>
            <Fragment>
                <Grow in><TeamMember user={cUser}/></Grow>
                <Divider light flexItem style={{height: 1}}/>
            </Fragment>
            {cUser.team.members.length > 0 && cUser.team.members.filter(m => m.id !== cUser.id).map((u, i) => {
                return <Fragment key={i}>
                    <Grow in><TeamMember user={u}/></Grow>
                    <Divider light flexItem style={{height: 1}}/>
                </Fragment>
            })
            }
        </Grid>
        <Box height='150px' width='100%'/>
        {
            cUser.team.id && <Grid item><Button onClick={async () => {
                if (cUser.team.id) {
                    const didLeave = await leaveTeam(cUser.team.id)
                    if (didLeave) {
                        enqueueSnackbar('Вы покинули команду', {
                            variant: 'success'
                        })
                    } else {
                        enqueueSnackbar('Не удалось покинуть команду', {
                            variant: 'error'
                        })
                    }
                } else {
                    enqueueSnackbar('Не удалось покинуть команду', {
                        variant: 'error'
                    })
                }
                nc.update()
            }}>Покинуть команду</Button>
            </Grid>
        }
        <Box height='32px' width='100%'/>
    </Grid>
}