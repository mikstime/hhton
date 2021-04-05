import React, {Fragment} from 'react'
import {EventLink, ExtLink, MenuBase, MenuProps} from './common'
import {HOST_DOMAIN, PREFIX} from '../../config/network'


export const UnAuthMenu: React.FC<MenuProps> = ({onClick}) => {

    const pageUrl = window.location.pathname.replace('/', '')
    return <MenuBase>
        <EventLink onClick={onClick}/>
        <ExtLink href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=${pageUrl}`}>
            Регистрация
        </ExtLink>
    </MenuBase>
}