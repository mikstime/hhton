import React from 'react'
import {Plate, PlateProps} from './plate'
import {Grid, GridProps} from '@material-ui/core'
import styled from 'styled-components'
import Image from 'material-ui-image'
import {Root} from './reusable'


const StyledImage = styled(Image)`
  border-radius: 4px;
`
const AvatarGrid: React.FC<{src: string} & GridProps> = ({src, ...rest}) => {
    return <Grid style={{display: 'block'}} {...rest}>
            <StyledImage src={src}/>
    </Grid>
}

export const AvatarPlate: React.FC<{
    src: string,
} & PlateProps> = ({src, children, ...rest}) => {

    return <Plate elevation={4} padding={24} {...rest}>
        <Root>
            <Grid container direction='column' style={{flex: 1}}>
                <AvatarGrid src={src} container/>
                <Grid item container>
                </Grid>
                <div style={{height: 16}}/>
                {children}
            </Grid>
        </Root>
    </Plate>
}