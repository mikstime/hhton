import React, {Fragment} from 'react'
import {
    Box, Button, Divider,
    Grid, Grow, Tooltip
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
        return <Tooltip
            title='Теперь Вы можете принимать решение о приеме и отклонении заявок, а также исключать членов команды'>
            <div>
                <AdditionalText>
                    <b>Вы</b> – лидер команды
                </AdditionalText>
            </div>
        </Tooltip>
    }

    if (cUser.team.teamLead.id !== cUser.id) {
        return <Tooltip
            title='Лидер команды может принимать решение о приеме и отклонении заявок, а также исключать членов команды'>
            <div>
                <AdditionalText>
                    <b>{cUser.team.teamLead.firstName} {cUser.team.teamLead.lastName}</b> –
                    лидер команды
                </AdditionalText>
            </div>
        </Tooltip>
    }

    return null
}

const LeaveButton: React.FC = () => {
    const {cUser} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()

    return <Button onClick={async () => {
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
}

export const TeamPage: React.FC = () => {

    const {cUser, cEvent} = useAppState()
    return <Grid container direction='column' wrap='nowrap'>
        <Grid item xs>
            <GrayPlate style={{marginBottom: 16}}>
                <AdditionalText>
                    Это ваша команда на мероприятии&nbsp;
                    <Link style={{textDecoration: 'none'}}
                          to={`/event/${cEvent.id}`}>
                        {cEvent.name}
                    </Link>. По окончании отбора состав команды автоматически
                    утвердится.
                    <br/><br/>
                    А пока что можете найти человека или команду при
                    помощи <Link
                    to='/feed' style={
                    {textDecoration: 'none'}
                }>умного поиска</Link>
                </AdditionalText>
            </GrayPlate>
        </Grid>
        <Grid container item xs spacing={1} direction='column' wrap='nowrap'>
            <TeamMember user={cUser}/>
            {cUser.team.members.length > 0 && cUser.team.members
                .filter(m => m.id !== cUser.id)
                .map((u, i) => <TeamMember key={i} user={u}/>)
            }
        </Grid>
        {/*<Box height='150px' width='100%'/>*/}
        {/*{*/}
        {/*    cUser.team.id && <Grid item>*/}
        {/*      <LeaveButton/>*/}
        {/*    </Grid>*/}
        {/*}*/}
        <Box height='32px' width='100%'/>
    </Grid>
}