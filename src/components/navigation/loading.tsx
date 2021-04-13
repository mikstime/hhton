import React from 'react'
import {EventLink, MenuBase, MenuProps} from './common'
import {Box} from '@material-ui/core'

export const LoadingMenu: React.FC<MenuProps> = ({onClick}) => {
    return <MenuBase onClick={onClick}>
        <EventLink onClick={onClick}/>
        <Box height='100%'/>
    </MenuBase>
}