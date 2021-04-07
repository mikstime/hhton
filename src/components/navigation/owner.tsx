import React from 'react'
import {EventLink, MenuBase, MenuProps} from './common'
import {NavLink} from './common'

export const OwnerMenu: React.FC<MenuProps> = ({onClick}) => {
    return <MenuBase>
        <EventLink onClick={onClick}/>
        <NavLink to='/event/create'>
            Новое мероприятие
        </NavLink>
    </MenuBase>
}