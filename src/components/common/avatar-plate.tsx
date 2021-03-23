import React from 'react'
import {Plate, PlateProps} from './plate'
import {Grid, GridDirection, GridProps} from '@material-ui/core'
import styled from 'styled-components'
import Image from 'material-ui-image'
import {Root} from './reusable'
import {EditableImage} from './editable-image'


const StyledImage = styled(Image)`
  border-radius: 4px;
`
const AvatarGrid: React.FC<{
    src: string, editable?: boolean,
    onEdit?: React.MouseEventHandler<HTMLDivElement>,
} & GridProps> = ({src, editable, onEdit, ...rest}) => {

    if (editable) {
        return <Grid {...rest}
                     style={{display: 'block', ...(rest.style || {})}}>
            <EditableImage onClick={onEdit}>
                <StyledImage src={src}/>
            </EditableImage>
        </Grid>
    }
    return <Grid {...rest} style={{display: 'block', ...(rest.style || {})}}>
        <StyledImage src={src}/>
    </Grid>
}

export const AvatarPlate: React.FC<{
    src: string,
    editable?: boolean,
    onEdit?: React.MouseEventHandler<HTMLDivElement>,
    direction?: GridDirection,
    avatarProps?: GridProps,
    afterChildren?: React.ReactElement
} & PlateProps> = ({src, children, editable, onEdit, direction = 'column', afterChildren, avatarProps = {}, ...rest}) => {
    return <Plate elevation={4} padding={24} {...rest}>
        <Root>
            <Grid container direction={direction}
                  style={{flex: 1, ...(avatarProps.style || {})}}>
                {direction === 'row' ?
                    <AvatarGrid xs={12} sm={7} item src={src}
                                editable={editable} onEdit={onEdit}
                                container {...avatarProps}/>
                    :
                    <AvatarGrid xs={12} item src={src}
                                editable={editable} onEdit={onEdit}
                                container {...avatarProps}/>
                }
                {children && direction === 'column' &&
                <div style={{height: 16}}/>}
                {children}
                {afterChildren}
            </Grid>
        </Root>
    </Plate>
}