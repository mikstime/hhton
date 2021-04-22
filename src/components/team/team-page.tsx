import React from 'react'
import {
    Box, Grid
} from '@material-ui/core'
import {AdditionalText, GrayPlate} from '../common'
import {useAppState} from '../tools/use-app-state'
import {TeamMember} from './team-member'
import {Link} from 'react-router-dom'

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
        <Grid container item xs direction='column' wrap='nowrap'>
            <TeamMember user={cUser}/>
            {cUser.team.members.length > 0 && cUser.team.members
                .filter(m => m.id !== cUser.id)
                .map((u, i) => <Box clone paddingTop='8px' key={i}><TeamMember user={u}/></Box>)
            }
        </Grid>
        <Box height='32px' width='100%'/>
    </Grid>
}