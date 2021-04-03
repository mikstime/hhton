import React, {Fragment, MouseEventHandler} from 'react'
import {Box, Grid} from '@material-ui/core'
import {MenuBase, MenuProps, NavLink} from './common'
import {AdditionalText} from '../common'
import {useAppState} from '../tools/use-app-state'


export const DefaultMenu: React.FC<MenuProps> = ({onClick}) => {
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