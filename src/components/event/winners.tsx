import React from 'react'
import {FlexSpace, GrayishPlate} from '../common'
import {Box, Grid, Typography} from '@material-ui/core'
const Place: React.FC<{
    place: string, height: number
}> = ({place, height}) => {
    return <Grid xs item container direction='column'>
        <Box width={64} height={64}>

        </Box>
        <Box width={64} height={height} style={{background: '#333333', borderRadius: 4}}>
            <Typography variant='h1' style={{color: 'white', lineHeight: `${height}px`}} align='center'>
            {place}
            </Typography>
        </Box>
    </Grid>
}
export const WinnersSection: React.FC = () => {
    return <Box clone marginTop={1} height='216px'>
        <GrayishPlate padding={16}>
            <Grid container>
                <Grid xs={12} sm={6} item container alignItems='flex-end' spacing={1}>
                    <Place place='1' height={108}/>
                    <Place place='2' height={79}/>
                    <Place place='3' height={54}/>
                    <FlexSpace/>
                </Grid>
                <Grid xs={12} sm={6} item container>
                </Grid>
            </Grid>
        </GrayishPlate>
    </Box>
}