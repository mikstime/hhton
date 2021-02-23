import React from 'react'
import {Typography, TypographyProps} from '@material-ui/core'

export const Title: React.FC<TypographyProps> = (props) => {
    return <Typography variant='h4' {...props}>
    </Typography>
}