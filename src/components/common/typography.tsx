import React from 'react'
import {
    makeStyles,
    Typography,
    TypographyProps
} from '@material-ui/core'
import {User} from '../tools/use-app-state/user'

const useStyles = makeStyles({
    h1: {
        marginTop: 36
    },
    body1: {
        fontWeight: 'bold',
    },
    body2: {
        marginTop: 24,
    },
})
export const Title: React.FC<TypographyProps> = (props) => {
    const classes = useStyles()
    return <Typography classes={classes} variant='h1' {...props}/>
}

export const SubTitle: React.FC<TypographyProps> = (props) => {
    return <Typography variant='h2' {...props}/>
}

export const MainText: React.FC<TypographyProps> = (props) => {
    return <Typography {...props}/>
}

export const BoldText: React.FC<TypographyProps> = (props) => {
    const classes = useStyles()
    return <Typography classes={classes} variant='body1' {...props}/>
}

export const AdditionalText: React.FC<TypographyProps> = (props) => {
    return <Typography variant='body2'{...props}/>
}

export const SecondaryText: React.FC<TypographyProps> = (props) => {
    const classes = useStyles()
    return <Typography classes={classes} variant='body2'{...props}/>
}
export const CaptionText: React.FC<TypographyProps> = (props) => {
    return <Typography variant='caption' {...props}/>
}

export const NameTypography: React.FC<{user: User} & TypographyProps> = ({user, ...props}) => {
    return <Typography {...props} style={{minHeight: 24,...(props.style || {})}}>
        {user.firstName} {user.lastName}
    </Typography>
}