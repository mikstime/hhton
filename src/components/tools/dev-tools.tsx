import React, {Fragment, useState} from 'react'
import {Button, Grid, InputBase, Typography} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {useAppState} from './use-app-state'
import {FlexSpace} from '../common'

export const DevTools: React.FC = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState('')
    const {user} = useAppState()
    return <Grid container spacing={1}>
        <Button onClick={() => setIsOpen(!isOpen)}>Dev Tools</Button>
        <Grid container alignItems='center' spacing={2}
              style={{background: '#f2f2f2', marginBottom: 40}}>
            {isOpen && <Fragment><Grid item>Меню разработчика: </Grid>
              <Grid item><Link to={'/user'}>user</Link></Grid>
              <Grid item><Link to={'/event'}>event</Link></Grid>
              <Grid item><Link to={'/team'}>team</Link></Grid>
              <Grid item><Link to={'/feed'}>feed</Link></Grid>
              <FlexSpace/>
              <Typography>User id:</Typography>
              <InputBase
                disabled={!user.firstName}
                style={{border: '1px solid red'}}
                placeholder='1'
                value={value}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        user.change({id: value})
                    }
                }}
                onChange={e => setValue(e.target.value)}
                onBlur={(e) => {
                    if(e && e.target) {
                        user.change({id: e.target.value})
                    }
                }}
              />
            </Fragment>
            }
        </Grid>
    </Grid>
}