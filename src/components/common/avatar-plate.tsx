import React from 'react'
import {Plate, PlateProps} from './plate'
import {PrimaryButton} from './buttons'
import {Grid, GridProps} from '@material-ui/core'
import styled from 'styled-components'
import Image from 'material-ui-image'
import {Root} from './reusable'


const StyledImage = styled(Image)`
  border-radius: 4px;
`
const AvatarGrid: React.FC<GridProps> = (props) => {
    return <Grid style={{display: 'block'}} {...props}>
            <StyledImage src="http://loremflickr.com/400/400"/>
    </Grid>
}

const StyledButton = styled(PrimaryButton)`
  margin-top: 16px !important;
`
export const AvatarPlate: React.FC<PlateProps> = ({...rest}) => {
    return <Plate elevation={4} padding={24} {...rest}>
        <Root>
            <Grid container direction='column' style={{flex: 1}}>
                <AvatarGrid container xs/>
                <Grid item container>
                </Grid>
                <StyledButton>
                    Объединиться
                </StyledButton>
            </Grid>
        </Root>
    </Plate>
}