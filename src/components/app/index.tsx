import React, {Fragment} from 'react'
import {Switch, Route} from 'react-router-dom'
import {UserApp} from './user'
import {EventApp} from './event'
import {TeamApp} from './team'
import {FeedApp} from './feed'
import {DevTools} from '../tools/dev-tools'
import {HomeApp} from './home'
import {useFetcher} from '../tools/use-fetcher'
import {useAuth} from '../tools/use-auth'

export const App: React.FC = () => {

    useFetcher()
    useAuth()

    return <Fragment>
        <DevTools/>
        <Switch>
            <Route path='/user/:userId'>
                <UserApp/>
            </Route>
            <Route path='/user'>
                <UserApp/>
            </Route>
            <Route path='/event'>
                <EventApp/>
            </Route>
            <Route path='/team'>
                <TeamApp/>
            </Route>
            <Route path='/feed'>
                <FeedApp/>
            </Route>
            <Route>
                <HomeApp/>
            </Route>
        </Switch>
    </Fragment>
}
