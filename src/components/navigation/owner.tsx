import React from 'react'
import {EventLink, MenuBase, MenuProps} from './common'
import {NavLink} from './common'
import {Box} from '@material-ui/core'

export const OwnerMenu: React.FC<MenuProps> = ({onClick}) => {
    return <MenuBase onClick={onClick}>
        <EventLink onClick={onClick}/>
        <NavLink to='/event/create'>
            Новое мероприятие
        </NavLink>
        <Box height='100%'/>
    </MenuBase>
}