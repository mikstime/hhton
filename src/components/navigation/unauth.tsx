import React from 'react'
import {EventLink, ExtLink, MenuBase, MenuProps, NavLink} from './common'
import {HOST_DOMAIN, PREFIX} from '../../config/network'
import {Box} from '@material-ui/core'


export const UnAuthMenu: React.FC<MenuProps> = ({onClick}) => {

    const pageUrl = window.location.pathname.replace('/', '')
    return <MenuBase onClick={onClick}>
        <EventLink onClick={onClick}/>
        {/*<NavLink to='/events'>*/}
        {/*    Другие мероприятия*/}
        {/*</NavLink>*/}
        <ExtLink href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=${pageUrl}`}>
            Регистрация
        </ExtLink>
        <Box height='100%'/>
        {/*<Box paddingLeft='32px' paddingTop='16px' paddingBottom='16px'>*/}
        {/*    <NavLink to='/feedback'>*/}
        {/*        Обратная связь*/}
        {/*    </NavLink>*/}
        {/*</Box>*/}
    </MenuBase>
}