import React, {Fragment} from 'react'
import {Box, Grid} from '@material-ui/core'
import {MenuBase, MenuProps} from './common'
import {NavLink} from './common'
import {AdditionalText} from '../common'
import {useAppState} from '../tools/use-app-state'

export const OwnerMenu: React.FC<MenuProps> = ({onClick}) => {
    const {cEvent, cUser} = useAppState()
    return <MenuBase>
        {!cEvent.isNullEvent && cEvent.id !== '-1' &&
        <NavLink to={`/event/${cEvent.id}`}
                 onClick={onClick}>
          <AdditionalText
            align='right'>
              {cEvent.name || 'К мероприятию'}
          </AdditionalText>
        </NavLink>
        }
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