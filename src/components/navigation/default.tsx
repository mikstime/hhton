import React from 'react'
import {EventLink, MenuBase, MenuProps, NavLink} from './common'
import {useAppState} from '../tools/use-app-state'


export const DefaultMenu: React.FC<MenuProps> = ({onClick}) => {
    const {cEvent} = useAppState()

    const isActive = cEvent.isParticipating && !cEvent.isFinished
    return <MenuBase>
        <EventLink onClick={onClick}/>
        {isActive &&
        <NavLink to={`/team`} onClick={onClick}>
          Команда
        </NavLink>
        }
        <NavLink to={`/user`} onClick={onClick}>
            Моя анкета
        </NavLink>
        {isActive &&
        <NavLink to={`/feed`}
                 onClick={onClick}>
          Поиск участников
        </NavLink>
        }
    </MenuBase>
}