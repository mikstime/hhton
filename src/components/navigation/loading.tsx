import React from 'react'
import {EventLink, MenuBase, MenuProps, NavLink} from './common'
import {Box} from '@material-ui/core'

export const LoadingMenu: React.FC<MenuProps> = ({onClick}) => {
    return <MenuBase onClick={onClick}>
        <EventLink onClick={onClick}/>
        <Box height='100%'/>
        {/*<Box paddingLeft='32px' paddingTop='16px' paddingBottom='16px'>*/}
        {/*    <NavLink to='/feedback'>*/}
        {/*        Обратная связь*/}
        {/*    </NavLink>*/}
        {/*</Box>*/}
    </MenuBase>
}