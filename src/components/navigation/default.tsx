import React, {Fragment, useState} from 'react'
import {EventLink, MenuBase, MenuProps, NavLink} from './common'
import {useAppState} from '../tools/use-app-state'
import {AdditionalText} from '../common'
import {Box, Button} from '@material-ui/core'


export const DefaultMenu: React.FC<MenuProps> = ({onClick}) => {
    const {cEvent} = useAppState()
    const [isHost, setIsHost] = useState(false)

    const isActive = cEvent.isParticipating && !cEvent.isFinished

    let toRender

    if (isHost) {
        toRender = <Fragment>
            <NavLink to={`/event/create`} onClick={onClick}>
                Создать мероприятие
            </NavLink>
        </Fragment>
    } else {
        toRender = <Fragment>
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
        </Fragment>
    }
    return <MenuBase>
        <EventLink onClick={onClick}/>
        {toRender}
        {/*<Box clone position='absolute' bottom='24px' left='16px' right='16px'>*/}
        <Box height='100%'/>
        <Button style={{
            textTransform: 'none'
        }} onClick={() => {
            setIsHost(!isHost)
        }}>
            <AdditionalText color={isHost ? 'primary' : 'initial'}>
                Режим организатора
            </AdditionalText>
        </Button>
        {/*</Box>*/}
    </MenuBase>
}