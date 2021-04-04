import React from 'react'
import {Box} from '@material-ui/core'
import {EventLink, MenuBase, MenuProps} from './common'
import {NavLink} from './common'
import {AdditionalText} from '../common'
import {useAppState} from '../tools/use-app-state'

export const OwnerMenu: React.FC<MenuProps> = ({onClick}) => {
    const {cUser} = useAppState()
    return <MenuBase>
        <EventLink onClick={onClick}/>
        <Box paddingTop={2}/>
        {cUser.id !== '-1' && !cUser.isNullUser &&
        <NavLink to={`/user`} onClick={onClick}>
          <AdditionalText align='right'>
            К себе
          </AdditionalText>
        </NavLink>
        }
        <Box height='100px'/>
        {
            !cUser.isNotAuthorized &&
            <NavLink to={`/event/create`} onClick={onClick}>
              <AdditionalText align='right'>
                Создать мероприятие
              </AdditionalText>
            </NavLink>
        }
    </MenuBase>
}