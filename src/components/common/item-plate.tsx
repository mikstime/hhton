import React, {ElementType} from 'react'
import {Plate, PlateProps} from './plate'
import {
    Grid,
    IconButton,
    SvgIcon,
    TypographyProps
} from '@material-ui/core'
import styled from 'styled-components'
import {AdditionalText} from './typography'

import {ReactComponent as JobIcon} from '../../assets/job.svg'
import {ReactComponent as BioIcon} from '../../assets/bio.svg'
import {ReactComponent as InfoIcon} from '../../assets/info.svg'

type ItemPlateProps = {
    text: string,
    textPlate?: React.ElementType<TypographyProps>
    postIcon?: ElementType<any>
    frontIcon?: ElementType<any>,
} & PlateProps


const PaddedPlate = styled(Plate)`
  padding: 8px 16px 8px 16px;
`
export const ItemPlate: React.FC<ItemPlateProps> = (
    {children, text, frontIcon, textPlate = AdditionalText, postIcon, ...rest}
) => {
    const TextPlate = textPlate
    return <PaddedPlate {...rest} lang='ru'>
        <Grid container wrap='nowrap' alignItems='center'>
            {frontIcon && text &&
            <Grid item style={{alignSelf: 'flex-start'}}>
              <SvgIcon style={{marginRight: 12}} component={frontIcon}/>
            </Grid>}
            <Grid item zeroMinWidth style={{minHeight: '24px'}}>
                <TextPlate style={{whiteSpace: 'pre-wrap', hyphens: 'auto'}} noWrap>{text}</TextPlate>
            </Grid>
            {postIcon && <Grid item><IconButton component={postIcon}/></Grid>}
        </Grid>
    </PaddedPlate>
}

export const JobPlate: React.FC<ItemPlateProps> = (props) => {
    return <ItemPlate frontIcon={JobIcon} {...props}/>
}

export const BioPlate: React.FC<ItemPlateProps> = (props) => {
    return <ItemPlate frontIcon={BioIcon} {...props}/>
}

export const InfoPlate: React.FC<ItemPlateProps> = (props) => {
    return <ItemPlate frontIcon={InfoIcon} {...props}/>
}