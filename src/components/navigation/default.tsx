import React, {Fragment} from 'react'
import {EventLink, MenuBase, MenuProps, NavLink} from './common'
import {useAppState} from '../tools/use-app-state'


export const DefaultMenu: React.FC<MenuProps> = ({onClick}) => {
    const {cEvent} = useAppState()

    const isActive = cEvent.isParticipating && !cEvent.isFinished
    return <MenuBase>
        <EventLink onClick={onClick}/>
        {
            isActive && <Fragment>
              <NavLink to={`/team`} onClick={onClick}>
                К команде
              </NavLink>
              <NavLink to={`/feed`}
                       onClick={onClick}>
                К поиску
              </NavLink>
            </Fragment>
        }
        <NavLink to={`/user`} onClick={onClick}>
            К себе
        </NavLink>
    </MenuBase>
}