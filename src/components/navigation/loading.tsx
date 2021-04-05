import React from 'react'
import {EventLink, MenuBase, MenuProps} from './common'

export const LoadingMenu: React.FC<MenuProps> = ({onClick}) => {
    return <MenuBase>
        <EventLink onClick={onClick}/>
    </MenuBase>
}