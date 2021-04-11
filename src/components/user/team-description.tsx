import React, {MouseEventHandler} from 'react'
import {AdditionalText, MainText} from '../common'
import {Box, Grid, useTheme} from '@material-ui/core'
import Image from 'material-ui-image'
import {User} from '../tools/use-app-state/user'
import {Link} from 'react-router-dom'
import {useAppState} from '../tools/use-app-state'

export const TeamItem: React.FC<{ user: User, onClick?: MouseEventHandler }> = ({user, onClick}) => {
    return <Grid item container alignItems='center'>
        <Link to={`/user/${user.id}`}
              style={{textDecoration: 'none'}}>
        <Image disableSpinner={true} imageStyle={{
            borderRadius: '50%',
            objectFit: 'cover',
        }} style={{
            width: 24,
            paddingTop: 24,
            borderRadius: '50%',
            margin: '8px 8px 0 0'
        }} src={user.avatar}/>
        </Link>
        <Link to={`/user/${user.id}`} onClick={onClick}
              style={{textDecoration: 'none', marginTop: 8, width: 'calc(100% - 32px)'}}>
            <Box clone style={{overflow: "hidden", textOverflow: "ellipsis", width: '100%',}}>
            <AdditionalText noWrap>
                {user.firstName} {user.lastName}
            </AdditionalText>
            </Box>
        </Link>
    </Grid>
}

const TO_SHOW = 40
export const TeamDescription: React.FC<{ noName?: boolean, user: User }> = ({user, noName}) => {

    const theme = useTheme()
    const {cUser, cEvent, settings} = useAppState()

    const filtered = user.team.members.filter(u => u.id !== user.id)
    const usersToShow = filtered.slice(0, TO_SHOW)
    const more = filtered.length - TO_SHOW > 0 ? filtered.length - TO_SHOW : 0

    if(cEvent.id === '-1' || cEvent.notFound || cEvent.isFinished || settings.isHostMode) {
        return null
    }

    if(cUser.id === user.id && !cEvent.isParticipating) {
        return <Grid item container direction='column'>
            <AdditionalText style={{marginTop: 12}} align='center'>
                Вы не участвуете в мероприятии <Link
                style={{textDecoration: 'none'}}
                to={`/event/${cEvent.id}`}>{cEvent.name}</Link>
            </AdditionalText>
        </Grid>
    }

    if (!user.isNullUser && user.team) {
        if (user.team.members && user.team.members.length > 1) {
            return <Grid item container direction='column'>
                <MainText style={{
                    marginTop: 12,
                    color: theme.typography.body2.color
                }}>
                    В команде с
                </MainText>
                {usersToShow.map((u, i) =>
                    <TeamItem key={i} user={u}/>)}
                {more > 0 &&             <AdditionalText style={{marginTop: 16}}>
                    ещё {more}
                </AdditionalText>}
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