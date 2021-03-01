import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {UserApp} from './user'
import {EventApp} from './event'
import {TeamApp} from './team'
import {FeedApp} from './feed'
import {Container} from '@material-ui/core'
import styled from 'styled-components'
import {DevTools} from '../tools/dev-tools'
import {useFetcher} from '../tools/use-fetcher'

const RootContainer = styled(Container)`
  min-height: 100vh;
`
export const App: React.FC = () => {
    useFetcher()
    return <RootContainer>
        <DevTools/>
        <Switch>
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
        </Switch>
    </RootContainer>
}
