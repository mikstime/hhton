import React, { Fragment } from 'react'
import {UserApp} from './user'

export const FeedApp: React.FC = () => {

    return <Fragment>
        {'<'}
        <UserApp/>
        {'>'}
    </Fragment>
}