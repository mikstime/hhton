import React from 'react'
import {Grid, GridProps, Paper} from '@material-ui/core'

export const GrayPlate: React.FC<GridProps> = ({children, ...props}) => {
    return <Grid {...props}>
        <Paper elevation={4}>
                {children}
        </Paper>
    </Grid>

}