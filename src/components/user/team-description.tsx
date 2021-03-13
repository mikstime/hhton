import React from 'react'
import {AdditionalText, MainText} from '../common'
import {Grid, useTheme} from '@material-ui/core'
import Image from 'material-ui-image'
import {User} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'
import {useAppState} from '../tools/use-app-state'

const TeamItem: React.FC<{ user: User }> = ({user}) => {
    return <Grid item container alignItems='center'>
        <Image disableSpinner={true} imageStyle={{borderRadius: '50%'}} style={{
            width: 24,
            paddingTop: 24,
            borderRadius: '50%',
            margin: '8px 8px 0 0'
        }} src={user.avatar}/>
        <Link to={`/user/${user.id}`}
              style={{textDecoration: 'none', marginTop: 8}}>
            <AdditionalText>
                {user.firstName} {user.lastName}
            </AdditionalText>
        </Link>
    </Grid>
}
export const TeamDescription: React.FC<{ noName?: boolean, user: User }> = ({user, noName}) => {

    const theme = useTheme()
    const {cUser} = useAppState()
    if (!user.isNullUser && user.team) {
        if (user.team.members && user.team.members.length > 1) {
            return <Grid item container direction='column'>
                <MainText style={{
                    marginTop: 12,
                    color: theme.typography.body2.color
                }}>
                    В команде с
                </MainText>
                {user.team.members.filter(u => u.id !== user.id).map(u =>
                    <TeamItem key={u.id} user={u}/>)}
            </Grid>
        } else {
            return <Grid item container direction='column'>
                <AdditionalText style={{marginTop: 12}} align='center'>
                    {noName ? `Сейчас без команды` : cUser.id === user.id ? `Вы сейчас без команды` : `${user.firstName} ${user.lastName} сейчас без команды`}
                </AdditionalText>
            </Grid>
        }
    }

    return null
}