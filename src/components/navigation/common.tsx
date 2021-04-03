import React, {MouseEventHandler} from 'react'
import {Link, LinkProps} from 'react-router-dom'
import {Box, useTheme} from '@material-ui/core'


export const NavLink: React.FC<LinkProps> = (props) => {
    const theme = useTheme()
    return <Box clone color={theme.typography.body2.color} paddingTop={2}>
        <Link {...props} style={{textDecoration: 'none'}}/>
    </Box>
}

export type MenuProps = {
    onClick: MouseEventHandler
}

export const MenuBase: React.FC = ({children}) => {
    return <Box display='flex' flexDirection='column'>
        {children}
    </Box>
}

export type EventLinkProps = LinkProps & {onEventChange: () => void}
export const EventLink: React.FC<EventLinkProps> = (props) => {
    return <Box/>
}