import React, {Fragment} from 'react'
import {
    Box, Divider,
    Grid, Grow
} from '@material-ui/core'
import {AdditionalText, GrayPlate} from '../common'
import {useAppState} from '../tools/use-app-state'
import {TeamMember} from './team-member'
import {Link} from 'react-router-dom'
import {TeamName} from './team-name'

export const TeamPage: React.FC = () => {

    const {cUser, cEvent} = useAppState()

    return <Grid container direction='column'>
        <TeamName/>
        <GrayPlate style={{marginBottom: 16}}>
            <AdditionalText>
                Это ваша команда на мероприятии&nbsp;
                <Link style={{textDecoration: 'none'}} to={`/event/${cEvent.id}`}>
                    {cEvent.name}
                </Link>. По окончании отбора состав команды автоматически утвердится.
                <br/><br/>
                А пока что можете найти человека или команду при помощи <Link to='/feed' style={
                {textDecoration: 'none'}
            }>умного поиска</Link>
            </AdditionalText>
        </GrayPlate>
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
        <Box height='150px' width='100%'/>
    </Grid>
}