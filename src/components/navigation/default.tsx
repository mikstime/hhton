import React, {Fragment} from 'react'
import {
    EventLink,
    HostModeToggler,
    MenuBase,
    MenuProps,
    NavLink
} from './common'
import {useAppState} from '../tools/use-app-state'
import {Badge, Box, Fade} from '@material-ui/core'
import {ReactComponent as SearchIcon} from '../../assets/navigation/search.svg'
import {ReactComponent as TeamIcon} from '../../assets/navigation/team.svg'
import {ReactComponent as UserIcon} from '../../assets/navigation/user.svg'
import {ReactComponent as CreateTeamIcon} from '../../assets/navigation/create_team.svg'

export const DefaultMenu: React.FC<MenuProps> = ({onClick}) => {
    const {cEvent, settings, invites} = useAppState()

    const isActive = cEvent.isParticipating && !cEvent.isFinished

    let toRender

    const teamIcon = (invites.i.team.length > 0
        || invites.i.personal.length > 0 ) ?
        <Badge variant='dot' color='primary'><TeamIcon/></Badge>
        : <TeamIcon/>

    if (settings.isHostMode) {
        toRender = <Fragment>
            <Fade in>
                <NavLink to={`/event/create`}
                         icon={<CreateTeamIcon/>}
                         onClick={onClick}>
                    Новое мероприятие
                </NavLink>
            </Fade>
        </Fragment>
    } else {
        toRender = <Fragment>
            {isActive &&
            <Fade in>
              <NavLink to={`/feed`}
                       icon={<SearchIcon/>}
                       onClick={onClick}>
                Поиск участников
              </NavLink>
            </Fade>
            }
            {isActive &&
            <Fade in>
              <NavLink to={`/team`}
                       icon={teamIcon}
                       onClick={onClick}>
                Команда
              </NavLink>
            </Fade>
            }
            <Fade in>
                <NavLink to={`/user`}
                         icon={<UserIcon/>}
                         onClick={onClick}
                >
                    Моя анкета
                </NavLink>
            </Fade>
        </Fragment>
    }
    return <MenuBase onClick={onClick}>
        <EventLink onClick={onClick}/>
        {toRender}
        <Box height='100%'/>
        {/*<Box paddingLeft='32px' paddingTop='16px' paddingBottom='16px'>*/}
        {/*    <NavLink to='/feedback'>*/}
        {/*        Обратная связь*/}
        {/*    </NavLink>*/}
        {/*</Box>*/}
        <HostModeToggler/>
    </MenuBase>
}