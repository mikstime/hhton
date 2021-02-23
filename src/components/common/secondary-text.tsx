import React from 'react'
import {Typography, TypographyProps} from '@material-ui/core'

export const SecondaryText: React.FC<TypographyProps> = (props) => {
    return <Typography variant='caption' {...props}>
    </Typography>
}