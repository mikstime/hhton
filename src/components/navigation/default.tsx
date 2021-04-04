import React, {Fragment} from 'react'
import {Box} from '@material-ui/core'
import {EventLink, MenuBase, MenuProps, NavLink} from './common'
import {AdditionalText} from '../common'
import {useAppState} from '../tools/use-app-state'


export const DefaultMenu: React.FC<MenuProps> = ({onClick}) => {
    const {cEvent, cUser} = useAppState()
    return <MenuBase>
        <EventLink onClick={onClick}/>
        {
            cEvent.isParticipating && !cUser.isNotAuthorized && cEvent.id !== '-1'
            && !cEvent.isFinished && cEvent.founderId !== cUser.id
            && !cEvent.notFound && <Fragment>
              <Box paddingTop={2}/>
              <NavLink to={`/team`} onClick={onClick}>
                <AdditionalText align='right'>
                  К команде
                </AdditionalText>
              </NavLink>
              <Box paddingTop={2}/>
              <NavLink to={`/feed`}
                       onClick={onClick}>
                <AdditionalText align='right'>
                  К поиску
                </AdditionalText>
              </NavLink>
            </Fragment>
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