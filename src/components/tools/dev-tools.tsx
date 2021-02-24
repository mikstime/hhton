import React from 'react'
import {Grid, TextField} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {useAppState} from './use-app-state'

export const DevTools: React.FC = () => {

    const {user} = useAppState()
    return <Grid container spacing={1} alignItems='center'>
        <Grid item>Меню разработчика: </Grid>
        <Grid item><Link to={'/user'}>user</Link></Grid>
        <Grid item><Link to={'/event'}>event</Link></Grid>
        <Grid item><Link to={'/team'}>team</Link></Grid>
        <Grid item><Link to={'/feed'}>feed</Link></Grid>
        <Grid item>
            <TextField
                variant="filled"
                value={user.id}
                onChange={(e) => {
                    user.change(e.target.value)
            }} label={'ID пользователя'}/>
        </Grid>
    </Grid>
}